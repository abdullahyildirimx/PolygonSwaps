![polygonswaps](https://polygonswaps.vercel.app/images/Swaps.png)

## Intro

[QuickSwap](https://quickswap.exchange/) is an automated market maker (“**AMM**”) that allows two tokens to be exchanged on the [Polygon](https://www.polygon.technology) (Polygon). It is fast, cheap, and allows anyone to participate.

##

This repo is responsible for the **exchange/pool** interfaace of the AMM: [quickswap.exchange](https://quickswap.exchange/)

## Run locally

Install packages

```js
yarn
```

Start application

```js
yarn start
```

## Change Polygon network

To change the Polygon network from test net, modify the `REACT_APP_CHAIN_ID` value in `.env`.

- MAIN NET `137`