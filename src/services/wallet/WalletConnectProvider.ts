import {
  AbstractBaseWallet,
  BasicException,
  ChainType,
  ConnectorNames,
  SdkProvider,
  Trace,
  WalletConnect,
  eventBus,
  getCurrentAddressInfo,
  sleep,
  useVisibilityChange,
} from 'ether-sdk'
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider } from '@web3modal/ethers/vue'
import { BrowserProvider } from 'ethers6'
import type { AutoConnectConnectCallback } from './WalletProvider'

export class WalletConnectProvider extends AbstractBaseWallet {
  downloadLink() {
    return ''
  }

  id() {
    return ConnectorNames.WalletConnect
  }

  async getWalletConnect(): Promise<WalletConnect> {
    const modal = await this.provider()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let walletProvider: any
    let open = false
    const first = (this.callBack as AutoConnectConnectCallback).firstConnect || false
    let firstCheckCount = 3
    while (true) {
      const isConnected = modal.getIsConnected()
      const state = modal.getState()
      Trace.debug('isConnected', isConnected, state, first)
      if (!isConnected) {
        if (!state.open) {
          if (open) throw new BasicException('User rejected the request')
          if (first && firstCheckCount > 0) {
            await sleep(1000)
            firstCheckCount--
            continue
          } else {
            await modal.open({
              view: 'Connect',
            })
          }
        } else {
          open = true
        }
        await sleep(1000)
        continue
      } else {
        walletProvider = modal.getWalletProvider()
      }
      Trace.debug('walletProvider', walletProvider, SdkProvider.currentChainType)

      if (walletProvider) {
        const chainInfo = getCurrentAddressInfo().getChainInfo(SdkProvider.currentChainType)
        if (modal.getState().selectedNetworkId !== chainInfo.chainId) {
          await modal.switchNetwork(chainInfo.chainId)
          continue
        }
      }
      if (walletProvider) {
        Trace.debug('walletProvider', 'close')
        setTimeout(() => {
          modal.close().catch()
        },1000)
        break
      }
    }
    Trace.debug('connect walletProvider', walletProvider)
    const walletConnectProvider = new BrowserProvider(walletProvider, 'any')
    const walletConnect = new WalletConnect(walletConnectProvider)
    walletConnect.provider = walletConnectProvider
    walletConnect.switchNetwork = async (_chainId) => {
      Trace.debug('switchNetwork', _chainId)
      if (!useVisibilityChange.current) throw new BasicException('Please switch wallet network')

      await modal.switchNetwork(_chainId)
    }

    walletConnect.disconnectCallBack = () => {
      eventBus.emit('disconnect', 'User disconnected the wallet')
      setTimeout(() => {
        modal.close().catch()
      },1000)
      modal.disconnect().catch()
    }
    walletConnect.connectCallBack = () => {
      setTimeout(() => {
        modal.close().catch()
      },1000)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let account: any = (await walletConnectProvider.getSigner()).getAddress()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chainId: any = (await walletConnectProvider.getNetwork()).chainId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modal.subscribeProvider((newState: any) => {
      if (newState && newState.provider) {
        if (newState.chainId !== chainId) {
          eventBus.emit('chainChanged', newState.chainId)
          chainId = newState.chainId
          return
        }
        if (account !== newState.address) {
          eventBus.emit('accountsChanged', [newState.address])
          account = newState.address
          return
        }
      }

      if (newState && newState.isConnected === false)
        eventBus.emit('disconnect', 'User disconnected the wallet')

      Trace.debug('newState', newState)
    })
    return walletConnect
  }

  installed(): boolean {
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async provider(): Promise<any> {
    const metadata = {
      name: 'Agni',
      description: 'Agni',
      url: 'https://agni.finance/', // origin must match your domain & subdomain
      icons: ['https://agni.finance/favicon.ico'],
    }
    const projectId = '64da8ef901e863b3d0b537c95bf2a938'

    const chains = [ChainType.arbitrum].map((it) => {
      const chainInfo = getCurrentAddressInfo().getChainInfo(it)
      return {
        chainId: chainInfo.chainId,
        name: chainInfo.chainName,
        currency: chainInfo.chainToken,
        explorerUrl: chainInfo.scan,
        rpcUrl: chainInfo.rpc,
      }
    })
    const modal = createWeb3Modal({
      ethersConfig: defaultConfig({ metadata }),
      chains,
      defaultChain: chains.find(
        (it) =>
          it.chainId === getCurrentAddressInfo().getChainInfo(SdkProvider.currentChainType).chainId,
      ),
      projectId,
      themeVariables: {
        '--w3m-z-index': 9999,
      },
      enableAnalytics:false,
      enableOnramp:false,
      featuredWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', //metamask
        '15c8b91ade1a4e58f3ce4e7a0dd7f42b47db0c8df7e0d84f63eb39bcb96c4e0f', //bybit
        '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
        '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
        'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef',
        '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
        '20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66',
        'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
        '2a3c89040ac3b723a1972a33a125b1db11e258a6975d3a61252cd64e6ea5ea01',
      ],
    })

    // modal.subscribeState((state) => {
    //   Trace.debug('subscribeState', state)
    // })

    // modal.subscribeEvents((c) => {
    //   Trace.debug('subscribeEvents', c)
    // })

    return modal
  }
}

export const walletConnectProvider = new WalletConnectProvider()
