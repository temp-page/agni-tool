/**
 * ABI
 */
import type { JsonFragment } from 'ethers6';

import AgniFactoryAbiJSON from '../../services/abi/AgniFactory.json'
export const AgniFactoryAbi = AgniFactoryAbiJSON as JsonFragment[]
export * from './AgniFactoryContract'

import AgniPoolAbiJSON from '../../services/abi/AgniPool.json'
export const AgniPoolAbi = AgniPoolAbiJSON as JsonFragment[]
export * from './AgniPoolContract'

