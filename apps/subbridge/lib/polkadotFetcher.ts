import {AssetId, OrmlToken} from '@/config/asset'
import {ChainId, CHAINS} from '@/config/chain'
import type {ApiPromise} from '@polkadot/api'
import Decimal from 'decimal.js'
import {transferByCrab} from './transferByCrab'
import {transferByKhalaXTransfer} from './transferByKhalaXTransfer'
import {transferByPolkadotXTokens} from './transferByPolkadotXTokens'

const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
const BLACK_HOLE = '0x0000000000000000000000000000000000000000'

export const polkadotAvailableBalanceFetcher = async (
  api: ApiPromise,
  address: string
) => {
  const allBalance = await api.derive.balances.all(address)

  return new Decimal(allBalance.availableBalance.toJSON()).div(
    Decimal.pow(10, api.registry.chainDecimals[0])
  )
}

export const palletAssetBalanceFetcher = async (
  polkadotApi: ApiPromise,
  address: string,
  palletAssetId: number,
  decimals: number
) => {
  const balance = await polkadotApi.query.assets.account(palletAssetId, address)
  const balanceJson = balance.toJSON()
  if (!balanceJson) {
    return new Decimal(0)
  }
  return new Decimal((balanceJson as {balance: number}).balance).div(
    Decimal.pow(10, decimals)
  )
}

export const ormlTokenBalanceFetcher = async (
  polkadotApi: ApiPromise,
  address: string,
  token: OrmlToken | {Token: OrmlToken},
  decimals: number
) => {
  const balance = await polkadotApi.query.tokens.accounts(address, token)

  return new Decimal((balance.toJSON() as {free: number}).free).div(
    Decimal.pow(10, decimals)
  )
}

export const khalaToEthereumBridgeFeeFetcher = async (khalaApi: ApiPromise) => {
  const fee = await khalaApi.query.chainBridge.bridgeFee(0)

  return new Decimal(fee.toJSON() as number).div(Decimal.pow(10, 12))
}

export const xTokensPartialFeeFetcher = async (
  polkadotApi: ApiPromise,
  fromChainId: ChainId,
  toChainId: ChainId,
  assetId: AssetId,
  isThroughKhala: boolean
) => {
  const {partialFee} = await transferByPolkadotXTokens({
    polkadotApi,
    assetId,
    amount: '1',
    fromChainId,
    toChainId,
    destinationAccount: ALICE,
    isThroughKhala,
  }).paymentInfo(ALICE)

  const decimals = polkadotApi.registry.chainDecimals[0]

  return new Decimal(partialFee.toString()).div(Decimal.pow(10, decimals))
}

export const khalaXTransferPartialFeeFetcher = async (
  khalaApi: ApiPromise,
  toChainId: ChainId,
  assetId: AssetId
) => {
  const toChain = CHAINS[toChainId]
  const extrinsic = transferByKhalaXTransfer({
    khalaApi,
    amount: '1',
    destinationAccount: toChain.kind === 'polkadot' ? ALICE : BLACK_HOLE,
    toChainId,
    assetId,
  })
  const decimals = khalaApi.registry.chainDecimals[0]
  const {partialFee} = await extrinsic.paymentInfo(ALICE)
  return new Decimal(partialFee.toString()).div(Decimal.pow(10, decimals))
}

export const crabTransferPartialFeeFetcher = async (
  crabApi: ApiPromise,
  toChainId: ChainId,
  assetId: AssetId
) => {
  const extrinsic = transferByCrab({
    polkadotApi: crabApi,
    amount: '1',
    destinationAccount: ALICE,
    toChainId,
    assetId,
  })
  const decimals = crabApi.registry.chainDecimals[0]
  const {partialFee} = await extrinsic.paymentInfo(ALICE)
  return new Decimal(partialFee.toString()).div(Decimal.pow(10, decimals))
}
