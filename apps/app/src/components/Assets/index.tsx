import Decimal from 'decimal.js'
import {useMemo} from 'react'
import {Helmet} from 'react-helmet'
import styled from 'styled-components'
import usePHAData from '../../hooks/usePHAData'
import AccountBanner from './AccountBanner'
import AssetList, {DataType} from './AssetList'

const Wrapper = styled.div``

const Index = () => {
  const phaData = usePHAData()

  const tableData: DataType[] = useMemo(() => {
    return [phaData]
  }, [phaData])

  const totalValue = useMemo<Decimal | null>(() => {
    if (!tableData.length) return null
    const sum = tableData.reduce((prev, curr) => {
      if (curr.value) {
        return prev.add(new Decimal(curr.value))
      }
      return prev.add(new Decimal(0))
    }, new Decimal(0))
    return sum
  }, [tableData])

  return (
    <Wrapper>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <AccountBanner totalValue={totalValue} />
      <AssetList tableData={tableData} />
    </Wrapper>
  )
}

export default Index
