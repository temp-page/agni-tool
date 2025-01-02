import type { ConnectCallback, WalletConnectStatus } from 'ether-sdk'
import { ConnectorNames, SdkProvider, injectedWallet, metamaskProvider } from 'ether-sdk'
import { walletConnectProvider } from './WalletConnectProvider'

// import { walletConnectProvider } from '@/components/wallet/WalletConnectProvider'

export interface WalletInstallInfo {
  id: ConnectorNames
  downloadLink: string | undefined
  installed: boolean
}

export interface AutoConnectConnectCallback extends ConnectCallback {
  firstConnect: boolean
}

export class WalletProvider {
  public static connect(
    connectorNames: ConnectorNames,
    statusUpdate: (status: WalletConnectStatus) => void,
    loadingUpdate: (loading: boolean) => void,
    firstConnect: boolean = false,
  ) {
    return WalletProvider._connect(connectorNames, {
      firstConnect,
      statusUpdate: (status) => {
        statusUpdate(status)
      },
      chainUpdate: (chainType) => {
        SdkProvider.fastSetChainType(chainType)
      },
      loading: (_loading) => {
        // 需要显示loading的回调
        loadingUpdate(_loading)
      },
    })
  }

  private static _connect(connectorNames: ConnectorNames, callBack: AutoConnectConnectCallback) {
    if (connectorNames === ConnectorNames.MetaMask) return metamaskProvider.connect(callBack)

    if (connectorNames === ConnectorNames.Injected) return injectedWallet.connect(callBack)

    if (connectorNames === ConnectorNames.WalletConnect)
      return walletConnectProvider.connect(callBack)

    throw new Error('connectorNames not found')
  }

  public static wallets(): WalletInstallInfo[] {
    return [metamaskProvider, injectedWallet, walletConnectProvider].map((it) => {
      return {
        id: it.id(),
        downloadLink: it.downloadLink(),
        installed: it.installed(),
      }
    })
  }
}
