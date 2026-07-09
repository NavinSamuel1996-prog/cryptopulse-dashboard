# CryptoPulse

A free, live crypto market dashboard — React + Vite + Tailwind CSS + Recharts, pulling directly from the [CoinGecko](https://www.coingecko.com/en/api) public API (no key required). No backend, no database — Phase 1 of a staged demo build (frontend-only, deployed to Vercel).

**Live at:** _add your Vercel URL here after deploying_

## What it shows

- Top 10 coins by market cap: price, 24h change, market cap — refreshed every 60s
- Combined market cap, average 24h change, best/worst performer stat tiles
- Click any coin card to load its 7-day price trend chart (area chart with hover tooltip, table view toggle)
- Dark/light mode (persisted), manual refresh

## Run locally

```
npm install
npm run dev
```

## Stack

React, Vite, Tailwind CSS v4, Recharts, CoinGecko public API. Deployed on Vercel.
