<script setup lang="ts">
import {  reactive } from 'vue'
import {
  ConnectorNames,
  SdkProvider,
  eventBus,
  injectedWallet,
  metamaskProvider,
  type ConnectInfo,
  type TransactionEvent,
} from 'ether-sdk'
import useStore from '@/models/_core'
import type { AbsMetaMaskProvider } from 'ether-sdk/lib/wallet/MetaMaskProvider'
import { EVENT_CONNECT, EVENT_DISCONNECT, EVENT_SEND_TX, type HomeChain } from '@/services'
import { walletConnectProvider } from '@/services/wallet/WalletConnectProvider'
import { WalletProvider } from '@/services/wallet/WalletProvider'
import { showToast,Notify ,Loading} from 'vant'

defineProps<{
  className?: string
}>()
const store = useStore()
const wallets: AbsMetaMaskProvider[] = [
  metamaskProvider,
  injectedWallet,
  walletConnectProvider as any,
]

function disconnect() {
  SdkProvider.disconnect()
  store.actions.logout()
}

function connect(walletName: string, first: boolean = false) {
  const wallet = wallets.find((w) => w.id() === walletName)
  if (!wallet || !wallet.installed()) {
    showToast('Wallet not installed')
    return
  }

  WalletProvider.connect(
    walletName as ConnectorNames,
    (status) => {
      store.actions.login(status)
    },
    (loading: boolean) => {
      store.actions.networkLoadingUpdate(loading)
    },
    first,
  )
}

eventBus.resetOn(EVENT_CONNECT, () => {
  connect(walletConnectProvider.id())
})

eventBus.resetOn(EVENT_DISCONNECT, () => {
  disconnect()
})
eventBus.resetOn(EVENT_SEND_TX, (args) => {
  sendTx(...args)
})

const tempWalletInfo = store.state.walletInfo
// console.log('walletInfo', tempWalletInfo)
if (store.state.walletConnect === 'unlink') {
  if (tempWalletInfo.walletName) connect(tempWalletInfo.walletName, true)
}

function showConnect() {
  eventBus.emit(EVENT_CONNECT, {})
}

const scanShow = reactive({
  show: false,
  scan: '',
})

async function sendTx(
  func: (connectInfo: ConnectInfo) => Promise<TransactionEvent>,
  successCallback: () => Promise<void>,
) {
  try {
    const connectInfo = SdkProvider.connect()
    const transactionEvent = await func(connectInfo)
    scanShow.scan = transactionEvent.scan()
    scanShow.show = true
    await transactionEvent.confirm()
    await successCallback()
    showToast('Transaction submitted successfully')
    return transactionEvent
  } catch (e) {
    console.error(e)
    showToast('ERROR：' + (e.message || e))
    throw e
  } finally {
    scanShow.show = false
  }
}
</script>

<template>
  <div
    v-if="store.state.walletConnect === 'unlink'"
    class="flex justify-center align-center"
  >
    <el-button @click="showConnect()">链接钱包</el-button>
  </div>
  <div v-else class="flex justify-center align-center" style="margin-top: 10px">
    <div>{{ store.state.walletInfo.walletAddress }}</div>
    <el-button @click="disconnect" style="margin-left: 10px">断开</el-button>
  </div>

  <Notify v-model:show="scanShow.show" type="success">
    <Loading style="margin-right: 4px" />
    <span
      ><a target="_blank" :href="scanShow.scan"
        >The transaction is being submitted, and the transaction is being confirmed</a
      ></span
    >
  </Notify>
</template>

<style scoped lang="scss"></style>
