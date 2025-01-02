<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ChainType, SdkProvider, Trace, useVisibilityChange } from 'ether-sdk'
import { initConfig } from '@/services'
import { networkKey } from './models/_core'

function autoConnectWallet() {
  // console.log(import.meta.env)
  initConfig()
  const network = localStorage.getItem(networkKey)
  Trace.setDebugShow(false)
  Trace.setLogShow(false)
  SdkProvider.initConfig('prod')
  SdkProvider.fastSetChainType((network || ChainType.arbitrum) as any)
  useVisibilityChange.install()
}
autoConnectWallet()
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
@media not screen and (max-width: 1280px) {
  main {
    min-height: calc(100vh - 120px);
  }
}
@media screen and (max-width: 1280px) {
  main {
    min-height: calc(100vh - 88px);
  }
}
</style>
