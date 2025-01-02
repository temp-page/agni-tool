<script setup lang="ts">
import WalletButton from '@/components/WalletButton.vue'
import {
  AgniFactoryContract,
  AgniPoolContract,
  EVENT_DISCONNECT,
  EVENT_SEND_TX,
  type HomeChain,
} from '@/services'
import useStore from '@/models/_core'
import {
  BASE_API,
  BigNumber,
  type ConnectInfo,
  ERC20Contract,
  eventBus,
  SdkProvider,
} from 'ether-sdk'
import { onMounted, ref, watch } from 'vue'

const store = useStore()

const loading = ref(false)

interface FeeDetail {
  id: string
  name: string
  token0: { symbol: string; decimals: string }
  token1: { symbol: string; decimals: string }
  fee: string
  feeProtocol0: string
  feeProtocol1: string
  feeUsd: number
}

const feeData = ref<FeeDetail[]>([])

async function initData() {
  try {
    loading.value = true
    const currentChainType = SdkProvider.currentChainType
    const connectInfo = BASE_API.getCurrentConnectInfo(currentChainType)
    // const chainInfo = connectInfo.addressInfo.getChainInfo(currentChainType) as HomeChain
    // const agniFactoryContract = connectInfo.create(AgniFactoryContract)

    const { pools } = await BASE_API.graphBase<{
      pools: {
        id: string
        token0: {
          symbol: string
          decimals: string
          derivedUSD: string
        }
        token1: {
          symbol: string
          decimals: string
          derivedUSD: string
        }
        feeTier: string
      }[]
    }>(
      'https://agni.finance/graph/subgraphs/name/agni/exchange-v3',
      `query b {
  pools(first: 1000) {
    id
    token0 {
      symbol
      decimals
      derivedUSD
    }
    token1 {
      symbol
      decimals
      derivedUSD
    }
    feeTier
  }
}`,
      {},
    )

    const [...data] = await connectInfo.multiCall().callObj(
      ...pools.map((pool) => {
        const agniFactoryContract = connectInfo.create(AgniPoolContract, pool.id)
        return {
          fee: agniFactoryContract.multicall.protocolFees(),
        }
      }),
    )

    const saveData = data
      .map((c: any, index: number) => {
        const fee = new BigNumber(pools[index].feeTier).div(1e4).toFixed()
        return {
          id: pools[index].id,
          token0: pools[index].token0,
          token1: pools[index].token1,
          fee: fee,
          feeProtocol0: new BigNumber(c.fee.token0)
            .div(10 ** parseInt(pools[index].token0.decimals, 10))
            .toFixed(),
          feeProtocol1: new BigNumber(c.fee.token1)
            .div(10 ** parseInt(pools[index].token1.decimals, 10))
            .toFixed(),
          feeUsd: new BigNumber(c.fee.token0)
            .div(10 **  parseInt(pools[index].token0.decimals, 10))
            .multipliedBy(pools[index].token0.derivedUSD)
            .plus(
              new BigNumber(c.fee.token1)
                .div(10 **  parseInt(pools[index].token1.decimals, 10))
                .multipliedBy(pools[index].token1.derivedUSD),
            )
            .dp(2, BigNumber.ROUND_DOWN)
            .toNumber(),
          name: pools[index].token0.symbol + '-' + pools[index].token1.symbol + '-' + fee + '%',
        } as FeeDetail
      })
      .sort((a: FeeDetail, b: FeeDetail) => {
        return new BigNumber(b.feeUsd).comparedTo(a.feeUsd)
      })
    feeData.value = saveData
    console.log(saveData)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initData()
})

async function claimSubmit(item: FeeDetail) {
  eventBus.emit(EVENT_SEND_TX, [
    async (connect: ConnectInfo) => {
      if (item.feeProtocol0 === '0' && item.feeProtocol1 === '0') {
        throw '手续费不能为0'
      }

      const agniFactoryContract = connect.create(AgniFactoryContract)
      return agniFactoryContract.collectProtocol(
        item.id,
        store.state.walletInfo.walletAddress as string,
        new BigNumber(item.feeProtocol0)
          .multipliedBy(10 ** parseInt(item.token0.decimals,10))
          .toFixed(0, BigNumber.ROUND_DOWN),
        new BigNumber(item.feeProtocol1)
          .multipliedBy(10 **  parseInt(item.token1.decimals,10))
          .toFixed(0, BigNumber.ROUND_DOWN),
      )
    },
    async () => {
      item.feeProtocol0 = '0'
      item.feeProtocol1 = '0'
    },
  ])
}
</script>

<template>
  <WalletButton></WalletButton>

  <el-button @click="initData">刷新数据</el-button>
  <el-table border :data="feeData" :loading="loading" stripe style="width: 100%">
    <el-table-column label="id" prop="id" fixed></el-table-column>
    <el-table-column label="name" prop="name" fixed></el-table-column>
    <el-table-column label="feeProtocol0" prop="feeProtocol0" sortable></el-table-column>
    <el-table-column label="token0" prop="token0.symbol"></el-table-column>
    <el-table-column label="feeProtocol1" prop="feeProtocol1" sortable></el-table-column>
    <el-table-column label="token1" prop="token1.symbol"></el-table-column>
    <el-table-column label="价值USD" prop="feeUsd" sortable></el-table-column>
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="scope">
        <el-button size="small" @click="claimSubmit(scope.row)" plain>领取</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped lang="scss"></style>
