import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import StatTiles from './components/StatTiles';
import CoinGrid from './components/CoinGrid';
import TrendChart from './components/TrendChart';
import { fetchTopCoins, fetchCoinHistory } from './lib/coingecko';
import { hasSupabase, fetchStoredHistory } from './lib/supabase';

const REFRESH_MS = 60_000;

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('cryptopulse-theme') || null);
  useEffect(() => {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    else document.documentElement.removeAttribute('data-theme');
  }, [theme]);
  const resolved =
    theme || (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const toggle = () => {
    const next = resolved === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('cryptopulse-theme', next);
  };
  return [resolved, toggle];
}

export default function App() {
  const [theme, toggleTheme] = useTheme();

  const [coins, setCoins] = useState([]);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [coinsError, setCoinsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedId, setSelectedId] = useState('bitcoin');
  const [historySource, setHistorySource] = useState('coingecko');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  const loadCoins = useCallback(async (isManual) => {
    if (isManual) setRefreshing(true);
    try {
      const data = await fetchTopCoins(10);
      setCoins(data);
      setCoinsError(null);
      setLastUpdated(new Date());
    } catch (e) {
      setCoinsError(e.message || 'Failed to load market data.');
    } finally {
      setCoinsLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, []);

  const loadHistory = useCallback(async (coinId, sourceToUse) => {
    setHistoryLoading(true);
    try {
      const data = sourceToUse === 'supabase' ? await fetchStoredHistory(coinId, 48) : await fetchCoinHistory(coinId, 7);
      setHistory(data);
      setHistoryError(null);
    } catch (e) {
      setHistoryError(e.message || 'Failed to load price history.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoins(false);
    const id = setInterval(() => loadCoins(false), REFRESH_MS);
    return () => clearInterval(id);
  }, [loadCoins]);

  useEffect(() => {
    loadHistory(selectedId, historySource);
  }, [selectedId, historySource, loadHistory]);

  const selectedCoin = coins.find((c) => c.id === selectedId);

  return (
    <div className="max-w-[1320px] mx-auto px-6 pb-16">
      <Header lastUpdated={lastUpdated} onRefresh={() => loadCoins(true)} refreshing={refreshing} theme={theme} onToggleTheme={toggleTheme} />

      {coinsError && (
        <div
          className="rounded-xl border px-4 py-3 text-sm mb-5"
          style={{ color: 'var(--critical)', borderColor: 'var(--border)', background: 'var(--surface-1)' }}
        >
          {coinsError}
        </div>
      )}

      {coinsLoading ? (
        <div className="py-24 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading live market data…
        </div>
      ) : (
        <>
          <StatTiles coins={coins} />
          <div className="mb-6">
            <CoinGrid coins={coins} selectedId={selectedId} onSelect={setSelectedId} />
          </div>
          <TrendChart
            coinName={selectedCoin?.name || '—'}
            coinSymbol={selectedCoin?.symbol || ''}
            points={history}
            loading={historyLoading}
            error={historyError}
            source={historySource}
            onSourceChange={setHistorySource}
            showSourceToggle={hasSupabase}
          />
        </>
      )}

      <footer className="mt-10 pt-5 text-xs flex flex-wrap justify-between gap-2" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--grid)' }}>
        <span>CryptoPulse — live data from the CoinGecko public API, refreshed every 60s</span>
        <span>React + Vite + Recharts, no backend</span>
      </footer>
    </div>
  );
}
