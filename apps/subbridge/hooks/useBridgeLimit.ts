import {ethersContractBalanceFetcher} from '@/lib/ethersFetcher'
import {palletAssetBalanceFetcher} from '@/lib/polkadotFetcher'
import {assetAtom, fromChainAtom, toChainAtom} from '@/store/bridge'
import Decimal from 'decimal.js'
import {useAtomValue} from 'jotai'
import useSWR from 'swr'
import {useEthersAssetContract} from './useEthersContract'
import {useEthersJsonRpcProvider} from './useEthersProvider'
import {usePolkadotApi} from './usePolkadotApi'

// TODO: if there were more assets need reserve account, add it to config
const moonriverZlkReserveAccount = '0xf88337a0db6e24Dff0fCD7F92ab0655B97A68d38'
const khalaZlkReserveAccount =
  '45eHPJrHZNZjsQLr8vhycrqGdHZ9XxerqL7pWYnZTLsnSU9j'
const refreshInterval = 12000

export const useBridgeLimit = () => {
  const fromChain = useAtomValue(fromChainAtom)
  const toChain = useAtomValue(toChainAtom)
  const asset = useAtomValue(assetAtom)
  const moonriverJsonRpcProvider = useEthersJsonRpcProvider(
    'https://rpc.api.moonriver.moonbeam.network'
  )
  const moonriverZlkContract = useEthersAssetContract(
    moonriverJsonRpcProvider,
    'moonriver',
    'zlk'
  )
  const khalaApi = usePolkadotApi('khala')

  const hasLimit =
    (fromChain.id === 'moonriver' || toChain.id === 'moonriver') &&
    asset.id === 'zlk'

  const {data: moonriverReservedZlk} = useSWR(
    toChain.id === 'moonriver' && asset.id === 'zlk' && moonriverZlkContract
      ? [
          moonriverZlkContract,
          moonriverZlkReserveAccount,
          asset.decimals.moonriver ?? asset.decimals.default,
        ]
      : null,
    ethersContractBalanceFetcher,
    {refreshInterval}
  )

  const {data: khalaReservedZlk} = useSWR(
    khalaApi && fromChain.id === 'moonriver' && asset.id === 'zlk'
      ? [
          khalaApi,
          khalaZlkReserveAccount,
          asset.palletAssetId?.khala,
          asset.decimals.khala ?? asset.decimals.default,
        ]
      : null,
    palletAssetBalanceFetcher,
    {refreshInterval}
  )

  return hasLimit
    ? moonriverReservedZlk || khalaReservedZlk
    : new Decimal(Infinity)
}
