// CryptoPulse Phase 2: scheduled snapshot of top-10 coin prices into Supabase.
// Deploy via the Supabase Dashboard -> Edge Functions -> Deploy a new function
// (paste this file's contents into the browser editor, name it "snapshot-prices").
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically by the
// Supabase runtime for every Edge Function -- nothing to configure by hand.

import { createClient } from 'npm:@supabase/supabase-js@2';

const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const res = await fetch(COINGECKO_URL);
    if (!res.ok) {
      throw new Error(`CoinGecko request failed: ${res.status}`);
    }
    const coins = await res.json();

    const rows = coins.map((c: any) => ({
      coin_id: c.id,
      symbol: c.symbol.toUpperCase(),
      price: c.current_price,
      market_cap: c.market_cap,
    }));

    const { error } = await supabase.from('price_snapshots').insert(rows);
    if (error) throw error;

    return new Response(JSON.stringify({ inserted: rows.length }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
