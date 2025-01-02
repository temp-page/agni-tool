import type { WalletConnectStatus } from 'ether-sdk'
import { ChainType, SdkProvider } from 'ether-sdk'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

const useStore = defineStore(
  'agni_tool_page_store',
  () => {
    const state = reactive<{
      walletInfo: WalletConnectStatus
      walletConnect: 'connect' | 'unlink'
      buttonLoading: boolean
      network: string
      networkLoading: boolean
    }>({
      walletConnect: 'unlink',
      walletInfo: {
        walletConnect: 'unlink',
        walletName: null,
        walletAddress: null,
        network: null,
        error: undefined,
      } as WalletConnectStatus,
      buttonLoading: false,
      networkLoading: false,
      network: '',
    })

    const actions = {
      login(data: WalletConnectStatus) {
        state.walletInfo = data
        state.walletConnect = data.walletConnect
        if (data.network) {
          state.network = data.network
          SdkProvider.fastSetChainType(ChainType[state.network as ChainType])
          localStorage.setItem(networkKey, state.network)
        }
      },
      logout() {
        state.walletInfo = {
          walletConnect: 'unlink',
          walletName: null,
          walletAddress: null,
          network: null,
          error: undefined,
        }
        state.walletConnect = 'unlink'
        localStorage.removeItem(networkKey)
      },
      updateNetwork(network: string) {
        state.network = network
        SdkProvider.setChainType(ChainType[network as ChainType])
      },
      buttonLoadingUpdate(_loading: boolean) {
        state.buttonLoading = _loading
      },
      networkLoadingUpdate(_loading: boolean) {
        state.networkLoading = _loading
      },
    }
    return {
      state,
      actions,
    }
  },
  {
    persist: {
      storage: localStorage, // 存储方式
      pick: ['state.walletInfo', 'state.network'], // 存储属性
    },
  },
)

export const networkKey = 'agni_tool__network'

export default useStore
