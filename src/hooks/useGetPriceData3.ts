import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useMulticallContract } from './useContract'
import ERC20_INTERFACE from '../constants/abis/erc20'

const priceContracts: {maticAddress: string, usdcAddress: string, lpAddress:string} = {
    maticAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    usdcAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    lpAddress: '0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827'
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

const useGetPriceData3 = () => {
  const [data, setData] = useState<number>(0)

  const multicallContract = useMulticallContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(multicallContract){
          const {maticAddress, usdcAddress, lpAddress} = priceContracts;
          const calls = [
            [maticAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
            [usdcAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
          ];
          const [resultsBlockNumber, result] = await multicallContract.aggregate(calls);
          const [maticAmount, usdcAmount] = result.map((r: any)=>ERC20_INTERFACE.decodeFunctionResult("balanceOf", r));
          const matic = new BigNumber(maticAmount);
          const usdc = new BigNumber(usdcAmount);
          const maticPrice = usdc.div(matic).times(10**12).toNumber();
          setData(maticPrice)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [multicallContract])

  return data
}

export default useGetPriceData3