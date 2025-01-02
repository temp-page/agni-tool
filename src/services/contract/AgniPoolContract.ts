
import { AgniPoolAbi } from './index'
import type { ConnectInfo, ContractCall, MulContract, TransactionEvent } from 'ether-sdk'
import { BaseAbi, CacheKey, EnableLogs } from 'ether-sdk'


// codegen for src/services/abi/AgniPool.json time 2025-01-02T08:55:49.914Z


@CacheKey('AgniPoolContract')
export class AgniPoolContract extends BaseAbi {

  multicall:AgniPoolMultiCall

  constructor(connectInfo: ConnectInfo,pool:string) {
    super(connectInfo,pool, AgniPoolAbi)
    this.multicall = new AgniPoolMultiCall(this.mulContract)
  }


  // burn(int24, int24, uint128) nonpayable returns(uint256, uint256)
  @EnableLogs()
  burn(tickLower: string, tickUpper: string, amount: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'burn', [tickLower, tickUpper, amount], {
        value: undefined
    })
  }


  // collect(address, int24, int24, uint128, uint128) nonpayable returns(uint128, uint128)
  @EnableLogs()
  collect(recipient: string, tickLower: string, tickUpper: string, amount0Requested: string, amount1Requested: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'collect', [recipient, tickLower, tickUpper, amount0Requested, amount1Requested], {
        value: undefined
    })
  }


  // collectProtocol(address, uint128, uint128) nonpayable returns(uint128, uint128)
  @EnableLogs()
  collectProtocol(recipient: string, amount0Requested: string, amount1Requested: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'collectProtocol', [recipient, amount0Requested, amount1Requested], {
        value: undefined
    })
  }


  // flash(address, uint256, uint256, bytes) nonpayable returns()
  @EnableLogs()
  flash(recipient: string, amount0: string, amount1: string, data: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'flash', [recipient, amount0, amount1, data], {
        value: undefined
    })
  }


  // increaseObservationCardinalityNext(uint16) nonpayable returns()
  @EnableLogs()
  increaseObservationCardinalityNext(observationCardinalityNext: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'increaseObservationCardinalityNext', [observationCardinalityNext], {
        value: undefined
    })
  }


  // initialize(uint160) nonpayable returns()
  @EnableLogs()
  initialize(sqrtPriceX96: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'initialize', [sqrtPriceX96], {
        value: undefined
    })
  }


  // mint(address, int24, int24, uint128, bytes) nonpayable returns(uint256, uint256)
  @EnableLogs()
  mint(recipient: string, tickLower: string, tickUpper: string, amount: string, data: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'mint', [recipient, tickLower, tickUpper, amount, data], {
        value: undefined
    })
  }


  // setFeeProtocol(uint32, uint32) nonpayable returns()
  @EnableLogs()
  setFeeProtocol(feeProtocol0: string, feeProtocol1: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'setFeeProtocol', [feeProtocol0, feeProtocol1], {
        value: undefined
    })
  }


  // setLmPool(address) nonpayable returns()
  @EnableLogs()
  setLmPool(_lmPool: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'setLmPool', [_lmPool], {
        value: undefined
    })
  }


  // swap(address, bool, int256, uint160, bytes) nonpayable returns(int256, int256)
  @EnableLogs()
  swap(recipient: string, zeroForOne: boolean, amountSpecified: string, sqrtPriceLimitX96: string, data: string): Promise<TransactionEvent> {
    return this.connectInfo.tx().sendContractTransaction(this.contract, 'swap', [recipient, zeroForOne, amountSpecified, sqrtPriceLimitX96, data], {
        value: undefined
    })
  }




  // GET factory() view returns(address)
  factory(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.factory());
  }

  // GET fee() view returns(uint24)
  fee(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.fee());
  }

  // GET feeGrowthGlobal0X128() view returns(uint256)
  feeGrowthGlobal0X128(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.feeGrowthGlobal0X128());
  }

  // GET feeGrowthGlobal1X128() view returns(uint256)
  feeGrowthGlobal1X128(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.feeGrowthGlobal1X128());
  }

  // GET liquidity() view returns(uint128)
  liquidity(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.liquidity());
  }

  // GET lmPool() view returns(address)
  lmPool(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.lmPool());
  }

  // GET maxLiquidityPerTick() view returns(uint128)
  maxLiquidityPerTick(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.maxLiquidityPerTick());
  }

  // GET observations(uint256) view returns(uint32, int56, uint160, bool)
  observations(anonymous0: string): Promise<{blockTimestamp: string, tickCumulative: string, secondsPerLiquidityCumulativeX128: string, initialized: boolean}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.observations(anonymous0));
  }

  // GET observe(uint32[]) view returns(int56[], uint160[])
  observe(secondsAgos: string[]): Promise<{tickCumulatives: string[], secondsPerLiquidityCumulativeX128s: string[]}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.observe(secondsAgos));
  }

  // GET positions(bytes32) view returns(uint128, uint256, uint256, uint128, uint128)
  positions(anonymous0: string): Promise<{liquidity: string, feeGrowthInside0LastX128: string, feeGrowthInside1LastX128: string, tokensOwed0: string, tokensOwed1: string}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.positions(anonymous0));
  }

  // GET protocolFees() view returns(uint128, uint128)
  protocolFees(): Promise<{token0: string, token1: string}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.protocolFees());
  }

  // GET slot0() view returns(uint160, int24, uint16, uint16, uint16, uint32, bool)
  slot0(): Promise<{sqrtPriceX96: string, tick: string, observationIndex: string, observationCardinality: string, observationCardinalityNext: string, feeProtocol: string, unlocked: boolean}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.slot0());
  }

  // GET snapshotCumulativesInside(int24, int24) view returns(int56, uint160, uint32)
  snapshotCumulativesInside(tickLower: string, tickUpper: string): Promise<{tickCumulativeInside: string, secondsPerLiquidityInsideX128: string, secondsInside: string}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.snapshotCumulativesInside(tickLower, tickUpper));
  }

  // GET tickBitmap(int16) view returns(uint256)
  tickBitmap(anonymous0: string): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.tickBitmap(anonymous0));
  }

  // GET tickSpacing() view returns(int24)
  tickSpacing(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.tickSpacing());
  }

  // GET ticks(int24) view returns(uint128, int128, uint256, uint256, int56, uint160, uint32, bool)
  ticks(anonymous0: string): Promise<{liquidityGross: string, liquidityNet: string, feeGrowthOutside0X128: string, feeGrowthOutside1X128: string, tickCumulativeOutside: string, secondsPerLiquidityOutsideX128: string, secondsOutside: string, initialized: boolean}> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.ticks(anonymous0));
  }

  // GET token0() view returns(address)
  token0(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.token0());
  }

  // GET token1() view returns(address)
  token1(): Promise<string> {
    return this.connectInfo.multiCall().singleCallObj(this.multicall.token1());
  }
}

export class AgniPoolMultiCall {

  private mulContract:MulContract

  constructor(mulContract:MulContract) {
    this.mulContract = mulContract
  }


  // factory() view returns(address)
  factory(): ContractCall<string> {
    return this.mulContract.factory()
  }

  // fee() view returns(uint24)
  fee(): ContractCall<string> {
    return this.mulContract.fee()
  }

  // feeGrowthGlobal0X128() view returns(uint256)
  feeGrowthGlobal0X128(): ContractCall<string> {
    return this.mulContract.feeGrowthGlobal0X128()
  }

  // feeGrowthGlobal1X128() view returns(uint256)
  feeGrowthGlobal1X128(): ContractCall<string> {
    return this.mulContract.feeGrowthGlobal1X128()
  }

  // liquidity() view returns(uint128)
  liquidity(): ContractCall<string> {
    return this.mulContract.liquidity()
  }

  // lmPool() view returns(address)
  lmPool(): ContractCall<string> {
    return this.mulContract.lmPool()
  }

  // maxLiquidityPerTick() view returns(uint128)
  maxLiquidityPerTick(): ContractCall<string> {
    return this.mulContract.maxLiquidityPerTick()
  }

  // observations(uint256) view returns(uint32, int56, uint160, bool)
  observations(anonymous0: string): ContractCall<{blockTimestamp: string, tickCumulative: string, secondsPerLiquidityCumulativeX128: string, initialized: boolean}> {
    return this.mulContract.observations(anonymous0)
  }

  // observe(uint32[]) view returns(int56[], uint160[])
  observe(secondsAgos: string[]): ContractCall<{tickCumulatives: string[], secondsPerLiquidityCumulativeX128s: string[]}> {
    return this.mulContract.observe(secondsAgos)
  }

  // positions(bytes32) view returns(uint128, uint256, uint256, uint128, uint128)
  positions(anonymous0: string): ContractCall<{liquidity: string, feeGrowthInside0LastX128: string, feeGrowthInside1LastX128: string, tokensOwed0: string, tokensOwed1: string}> {
    return this.mulContract.positions(anonymous0)
  }

  // protocolFees() view returns(uint128, uint128)
  protocolFees(): ContractCall<{token0: string, token1: string}> {
    return this.mulContract.protocolFees()
  }

  // slot0() view returns(uint160, int24, uint16, uint16, uint16, uint32, bool)
  slot0(): ContractCall<{sqrtPriceX96: string, tick: string, observationIndex: string, observationCardinality: string, observationCardinalityNext: string, feeProtocol: string, unlocked: boolean}> {
    return this.mulContract.slot0()
  }

  // snapshotCumulativesInside(int24, int24) view returns(int56, uint160, uint32)
  snapshotCumulativesInside(tickLower: string, tickUpper: string): ContractCall<{tickCumulativeInside: string, secondsPerLiquidityInsideX128: string, secondsInside: string}> {
    return this.mulContract.snapshotCumulativesInside(tickLower, tickUpper)
  }

  // tickBitmap(int16) view returns(uint256)
  tickBitmap(anonymous0: string): ContractCall<string> {
    return this.mulContract.tickBitmap(anonymous0)
  }

  // tickSpacing() view returns(int24)
  tickSpacing(): ContractCall<string> {
    return this.mulContract.tickSpacing()
  }

  // ticks(int24) view returns(uint128, int128, uint256, uint256, int56, uint160, uint32, bool)
  ticks(anonymous0: string): ContractCall<{liquidityGross: string, liquidityNet: string, feeGrowthOutside0X128: string, feeGrowthOutside1X128: string, tickCumulativeOutside: string, secondsPerLiquidityOutsideX128: string, secondsOutside: string, initialized: boolean}> {
    return this.mulContract.ticks(anonymous0)
  }

  // token0() view returns(address)
  token0(): ContractCall<string> {
    return this.mulContract.token0()
  }

  // token1() view returns(address)
  token1(): ContractCall<string> {
    return this.mulContract.token1()
  }

}



