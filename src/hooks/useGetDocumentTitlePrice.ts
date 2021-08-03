import { useEffect } from 'react'
import useGetPriceData from './useGetPriceData'

const useGetDocumentTitlePrice = () => {
  const priceData = useGetPriceData()

  const btcPriceUsd = priceData || 0

  function numberWithCommas(x: string|number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
    
  const btcPriceUsdString =
    Number.isNaN(btcPriceUsd) || btcPriceUsd === 0
      ? ''
      : `$${numberWithCommas(btcPriceUsd.toFixed(2))} - `

  useEffect(() => {
    document.title = `${btcPriceUsdString}PolygonSwaps`
  }, [btcPriceUsdString])
}
export default useGetDocumentTitlePrice