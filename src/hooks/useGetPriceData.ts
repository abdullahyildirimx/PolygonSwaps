import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useMulticallContract } from './useContract'
import ERC20_INTERFACE from '../constants/abis/erc20'

const priceContracts: {btcAddress: string, usdcAddress: string, lpAddress:string} = {
    btcAddress: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    usdcAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    lpAddress: '0xf6a637525402643b0654a54bead2cb9a83c8b498'
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

const useGetPriceData = () => {
  const [data, setData] = useState<number>(0)

  const multicallContract = useMulticallContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(multicallContract){
          const {btcAddress, usdcAddress, lpAddress} = priceContracts;
          const calls = [
            [btcAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
            [usdcAddress, ERC20_INTERFACE.encodeFunctionData("balanceOf", [lpAddress])],
          ];
          const [resultsBlockNumber, result] = await multicallContract.aggregate(calls);
          const [btcAmount, usdcAmount] = result.map((r: any)=>ERC20_INTERFACE.decodeFunctionResult("balanceOf", r));
          const btc = new BigNumber(btcAmount);
          const usdc = new BigNumber(usdcAmount);
          const btcPrice = usdc.div(btc).times(100).toNumber();
          setData(btcPrice)
        }
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [multicallContract])

  return data
}

export default useGetPriceData