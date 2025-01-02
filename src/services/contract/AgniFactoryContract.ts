
import { AgniFactoryAbi } from './index'
import type { ConnectInfo, ContractCall, MulContract, TransactionEvent } from 'ether-sdk'
import { BaseAbi, CacheKey, EnableLogs } from 'ether-sdk'
import type { HomeChain } from '@/services'


// codegen for src/services/abi/AgniFactory.json time 2025-01-02T08:55:49.910Z


@CacheKey('AgniFactoryContract')
export class AgniFactoryContract extends BaseAbi {

  multicall:AgniFactoryMultiCall

  constructor(connectInfo: ConnectInfo) {
    super(connectInfo, (connectInfo.chainInfo() as HomeChain).agniFactory, AgniFactoryAbi)
    this.multicall = new AgniFactoryMultiCall(this.mulContract)
  }


  // collectProtocol(address, address, uint128, uint128) nonpayable returns(uint128, uint128)
  @EnableLogs()
  collectProtocol(pool: string, recipient: string, amount0Requested: string, amount1Requested: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'collectProtocol', [pool, recipient, amount0Requested, amount1Requested], {
        value: undefined
    })
  }


  // createPool(address, address, uint24) nonpayable returns(address)
  @EnableLogs()
  createPool(tokenA: string, tokenB: string, fee: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'createPool', [tokenA, tokenB, fee], {
        value: undefined
    })
  }


  // enableFeeAmount(uint24, int24) nonpayable returns()
  @EnableLogs()
  enableFeeAmount(fee: string, tickSpacing: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'enableFeeAmount', [fee, tickSpacing], {
        value: undefined
    })
  }


  // setFeeAmountExtraInfo(uint24, bool, bool) nonpayable returns()
  @EnableLogs()
  setFeeAmountExtraInfo(fee: string, whitelistRequested: boolean, enabled: boolean): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'setFeeAmountExtraInfo', [fee, whitelistRequested, enabled], {
        value: undefined
    })
  }


  // setFeeProtocol(address, uint32, uint32) nonpayable returns()
  @EnableLogs()
  setFeeProtocol(pool: string, feeProtocol0: string, feeProtocol1: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'setFeeProtocol', [pool, feeProtocol0, feeProtocol1], {
        value: undefined
    })
  }


  // setLmPool(address, address) nonpayable returns()
  @EnableLogs()
  setLmPool(pool: string, lmPool: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'setLmPool', [pool, lmPool], {
        value: undefined
    })
  }


  // setLmPoolDeployer(address) nonpayable returns()
  @EnableLogs()
  setLmPoolDeployer(_lmPoolDeployer: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'setLmPoolDeployer', [_lmPoolDeployer], {
        value: undefined
    })
  }


  // setOwner(address) nonpayable returns()
  @EnableLogs()
  setOwner(_owner: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'setOwner', [_owner], {
        value: undefined
    })
  }


  // setWhiteListAddress(address, bool) nonpayable returns()
  @EnableLogs()
  setWhiteListAddress(user: string, verified: boolean): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'setWhiteListAddress', [user, verified], {
        value: undefined
    })
  }




  // GET feeAmountTickSpacing(uint24) view returns(int24)
  feeAmountTickSpacing(anonymous0: string): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.feeAmountTickSpacing(anonymous0));
  }

  // GET feeAmountTickSpacingExtraInfo(uint24) view returns(bool, bool)
  feeAmountTickSpacingExtraInfo(anonymous0: string): Promise<{whitelistRequested: boolean, enabled: boolean}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.feeAmountTickSpacingExtraInfo(anonymous0));
  }

  // GET getPool(address, address, uint24) view returns(address)
  getPool(anonymous0: string, anonymous1: string, anonymous2: string): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.getPool(anonymous0, anonymous1, anonymous2));
  }

  // GET lmPoolDeployer() view returns(address)
  lmPoolDeployer(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.lmPoolDeployer());
  }

  // GET owner() view returns(address)
  owner(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.owner());
  }

  // GET poolDeployer() view returns(address)
  poolDeployer(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.poolDeployer());
  }
}

export class AgniFactoryMultiCall {

  private mulContract:MulContract

  constructor(mulContract:MulContract) {
    this.mulContract = mulContract
  }


  // feeAmountTickSpacing(uint24) view returns(int24)
  feeAmountTickSpacing(anonymous0: string): ContractCall<string> {
    return this.mulContract.feeAmountTickSpacing(anonymous0)
  }

  // feeAmountTickSpacingExtraInfo(uint24) view returns(bool, bool)
  feeAmountTickSpacingExtraInfo(anonymous0: string): ContractCall<{whitelistRequested: boolean, enabled: boolean}> {
    return this.mulContract.feeAmountTickSpacingExtraInfo(anonymous0)
  }

  // getPool(address, address, uint24) view returns(address)
  getPool(anonymous0: string, anonymous1: string, anonymous2: string): ContractCall<string> {
    return this.mulContract.getPool(anonymous0, anonymous1, anonymous2)
  }

  // lmPoolDeployer() view returns(address)
  lmPoolDeployer(): ContractCall<string> {
    return this.mulContract.lmPoolDeployer()
  }

  // owner() view returns(address)
  owner(): ContractCall<string> {
    return this.mulContract.owner()
  }

  // poolDeployer() view returns(address)
  poolDeployer(): ContractCall<string> {
    return this.mulContract.poolDeployer()
  }

}



