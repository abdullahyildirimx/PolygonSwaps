import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useMulticallContract } from './useContract'
import ERC20_INTERFACE from '../constants/abis/erc20'

const priceContracts: {ethAddress: string, usdcAddress: string, lpAddress:string} = {
    ethAddress: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    usdcAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    lpAddress: '0x853ee4b2a13f8a742d64c8f088be7ba2131f670d'
}

type ApiResponse = {
  prices: {
    [key: string]: string
  }
  update_at: string
}

/**
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
const api = 'https://api.pancakeswap.com/api/v1/price'

const useGetPriceData2 = () => {
  const [data, setData] = useState<number>(0)

  const multicallContract = useMulticallContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(multicallContract){
          const {ethAddress, usdcAddress, lpAddress} = priceContracts;
          const calls = [
            [ethAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
            [usdcAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
          ];
          const [resultsBlockNumber, result] = await multicallContract.aggregate(calls);
          const [ethAmount, usdcAmount] = result.map((r: any)=>ERC20_INTERFACE.decodeFunctionResult("balanceOf", r));
          const eth = new BigNumber(ethAmount);
          const usdc = new BigNumber(usdcAmount);
          const ethPrice = usdc.div(eth).times(10**12).toNumber();
          setData(ethPrice)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [multicallContract])

  return data
}

export default useGetPriceData2