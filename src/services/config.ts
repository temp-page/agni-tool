import type { ChainInfo } from 'ether-sdk'
import {
  AddressInfo,
  ChainType,
  ConnectManager,
  setInitAddress,
  updateCurrentAddressInfo,
} from 'ether-sdk'

export interface HomeChain extends ChainInfo {
  agniFactory: string
}

export function initConfig() {
  setInitAddress((ENV: string) => {
    const mainnet: HomeChain = {
      chainId: 5000,
      chainName: 'Mantle',
      scan: 'https://explorer.mantle.xyz',
      rpc: 'https://rpc-tob.mantle.xyz/v1/ZTg2Y2QwN2FlNzM1NzYxMDNhMDgwNmNl',
      multicall: '0x05f3105fc9FC531712b2570f1C6E11dD4bCf7B3c',
      chainType: ChainType.arbitrum,
      agniFactory: '0x25780dc8Fc3cfBD75F33bFDAB65e969b603b2035',
      chainToken: 'MNT',
    }
    const addressInfo = new AddressInfo([mainnet])
    addressInfo.env = ENV
    updateCurrentAddressInfo(addressInfo)
    ConnectManager.chainMap[mainnet.chainName] = [
      {
        chainId: `0x${parseInt(Number(mainnet.chainId).toFixed(), 16)}`,
        chainName: mainnet.chainName,
        nativeCurrency: {
          name: mainnet.chainToken,
          symbol: mainnet.chainToken,
          decimals: 18,
        },
        rpcUrls: [mainnet.rpc],
        blockExplorerUrls: [mainnet.scan],
      },
    ]
  })
}
