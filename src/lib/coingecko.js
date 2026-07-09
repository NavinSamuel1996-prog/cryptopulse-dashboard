const BASE = 'https://api.coingecko.com/api/v3';

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 429) throw new Error('Rate limited by CoinGecko — try again in a minute.');
    throw new Error(`CoinGecko request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchTopCoins(count = 10) {
  const url = `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false&price_change_percentage=24h`;
  const data = await getJSON(url);
  return data.map((c) => ({
    id: c.id,
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    image: c.image,
    price: c.current_price,
    change24h: c.price_change_percentage_24h,
    marketCap: c.market_cap,
    volume: c.total_volume,
    rank: c.market_cap_rank,
  }));
}

export async function fetchCoinHistory(coinId, days = 7) {
  const url = `${BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
  const data = await getJSON(url);
  return (data.prices || []).map(([ts, price]) => ({ ts, price }));
}
