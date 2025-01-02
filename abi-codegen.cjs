// import * as path from 'path'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs')

const fileNames = [
  'src/services/abi/AgniFactory.json',
  'src/services/abi/AgniPool.json',
]

const outPath = 'src/services/contract'

function abiInfoToString(abiInfo) {
  return `${abiInfo.name}(${abiInfo.inputs.map(it => `${it.type}`).join(', ')}) ${abiInfo.stateMutability} returns(${abiInfo.outputs.map(it => `${it.type}`).join(', ')})`
}

function getName(name,index){
  return name === '' ? ('anonymous' + index ): name
}

function getMulString(abiInfo) {
  if (abiInfo.outputs.length === 0) {
    return ''
  }
  return `
  // ${abiInfoToString(abiInfo)}
  ${abiInfo.name}(${abiInfo.inputs.map((it,index) => `${getName(it.name,index)}: ${typeMapping(it)}`).join(', ')}): ContractCall<${getOutPutParams(abiInfo)}> {
    return this.mulContract.${abiInfo.name}(${abiInfo.inputs.map((it,index) => `${getName(it.name,index)}`).join(', ')})
  }`
}

function getQueryString(abiInfo) {
  if (abiInfo.outputs.length === 0) {
    return ''
  }
  return `
  // GET ${abiInfoToString(abiInfo)}
  ${abiInfo.name}(${abiInfo.inputs.map((it,index) => `${getName(it.name,index)}: ${typeMapping(it)}`).join(', ')}): Promise<${getOutPutParams(abiInfo)}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.${abiInfo.name}(${abiInfo.inputs.map((it,index) => `${getName(it.name,index)}`).join(', ')}));
  }`
}

function getTxString(abiInfo) {
  const inputArray = abiInfo.inputs.map((it,index) =>`${getName(it.name,index)}: ${typeMapping(it)}`)

  if (abiInfo.stateMutability === 'payable') {
    inputArray.push(
      'value: string',
    )
  }

  return `
  // ${abiInfoToString(abiInfo)}
  @EnableLogs()
  ${abiInfo.name}(${inputArray.join(', ')}): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, '${abiInfo.name}', [${abiInfo.inputs.map((it,index) => `${getName(it.name,index)}`).join(', ')}], {
        value: ${abiInfo.stateMutability === 'payable' ? 'value' : 'undefined'}
    })
  }
`
}

function typeMapping(params) {
  if (params.type === 'bool') {
    return `boolean`
  }

  if (params.type === 'bool[]') {
    return `boolean[]`
  }

  if (params.type === 'tuple') {
    return `{
      ${params.components.map((it,index) => `${getName(it.name,index)}: ${typeMapping(it)}`).join(',\n')}
    }`
  }
  if (params.type === 'tuple[]') {
    return `{
      ${params.components.map((it,index) => `${getName(it.name,index)}: ${typeMapping(it)}`).join(',\n')}
    }[]`
  }
  if (params.type.includes('[]')) {
    return `string[]`
  }
  return `string`
}

function getOutPutParams(abiInfo) {
  if (abiInfo.outputs.length === 1) {
    return abiInfo.outputs.map(it => `${typeMapping(it)}`).join(', ')
  }
  else {
    if (abiInfo.outputs.filter((it,index) => getName(it.name,index) !== '').length === abiInfo.outputs.length) {
      return `{${abiInfo.outputs.map((it,index) => `${getName(it.name,index)}: ${typeMapping(it)}`).join(', ')}}`
    }
    else {
      return `[${abiInfo.outputs.map(it => `${typeMapping(it)}`).join(', ')}]`
    }
  }
}

let abiIndexTs = `/**
 * ABI
 */
import type { JsonFragment } from 'ethers6';

`
for (const fileName of fileNames) {
  if (fileName.includes('json')) {
    const file = `${fileName}`

    const content = fs.readFileSync(file, 'utf-8')

    let abi = JSON.parse(content)

    if (!Array.isArray(abi)) {
      if (Array.isArray(abi.abi)) {
        abi = abi.abi
      }
      else {
        throw 'abi error'
      }
    }

    const params = {
      fileName,
      time: new Date().toISOString(),
      name: fileName.substring(fileName.lastIndexOf('/') + 1, fileName.lastIndexOf('.')),
      abi,
      abiImportFileName: fileName.replaceAll('src/', '../../'),
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abiIndexTs += `import ${params.name}AbiJSON from '${params.abiImportFileName}'
export const ${params.name}Abi = ${params.name}AbiJSON as JsonFragment[]
export * from './${params.name}Contract'

`

    let writeContent = ''
    let queryContent = ''
    let multiCallContent = ''

    for (const abiInfo of params.abi) {
      if (abiInfo.type === 'function') {
        if (['pure', 'view'].includes(abiInfo.stateMutability)) {
          if (abiInfo.outputs.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            multiCallContent += `
  ${getMulString(abiInfo)}`
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            queryContent += `
  ${getQueryString(abiInfo)}`
          }
        }
        if (['nonpayable', 'payable'].includes(abiInfo.stateMutability)) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          writeContent += `
  ${getTxString(abiInfo)}`
        }
      }
    }

    const contractContent = `
import { ${params.name}Abi } from './index'
import type { ConnectInfo, ContractCall, MulContract, TransactionEvent } from 'ether-sdk'
import { BaseAbi, CacheKey, EnableLogs } from 'ether-sdk'


// codegen for ${params.fileName} time ${params.time}


@CacheKey('${params.name}Contract')
export class ${params.name}Contract extends BaseAbi {

  multicall:${params.name}MultiCall

  constructor(connectInfo: ConnectInfo) {
    super(connectInfo, connectInfo.chainInfo().GBU, ${params.name}Abi)
    this.multicall = new ${params.name}MultiCall(this.mulContract)
  }
${writeContent}

${queryContent}
}

export class ${params.name}MultiCall {

  private mulContract:MulContract

  constructor(mulContract:MulContract) {
    this.mulContract = mulContract
  }
${multiCallContent}

}



      `

    fs.writeFileSync(`${outPath}/${params.name}Contract.ts`, contractContent, 'utf-8')
    // fs.writeFileSync(`${outPath}/TESTContract.ts`, contractContent, 'utf-8')
  }
}

fs.writeFileSync(`${outPath}/index.ts`, abiIndexTs, 'utf-8')
