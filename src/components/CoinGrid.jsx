import { fmtPrice, fmtCompactUSD, fmtPct } from '../lib/format';

function CoinCard({ coin, selected, onSelect }) {
  const up = coin.change24h >= 0;
  return (
    <button
      type="button"
      onClick={() => onSelect(coin.id)}
      aria-pressed={selected}
      className="text-left rounded-2xl border p-4 cursor-pointer transition-colors"
      style={{
        background: 'var(--surface-1)',
        borderColor: selected ? 'var(--s1)' : 'var(--border)',
        borderWidth: selected ? 2 : 1,
        boxShadow: 'var(--shadow)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <img src={coin.image} alt="" width={22} height={22} className="rounded-full shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {coin.name}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {coin.symbol}
            </div>
          </div>
        </div>
        <span
          className="text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0"
          style={{ color: 'var(--text-muted)', background: 'var(--page)', border: '1px solid var(--border)' }}
        >
          #{coin.rank}
        </span>
      </div>

      <div className="mt-3 text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {fmtPrice(coin.price)}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: up ? 'var(--success-text)' : 'var(--critical)' }}>
          {up ? '▲ ' : '▼ '}
          {fmtPct(coin.change24h)}
          <span className="font-normal" style={{ color: 'var(--text-muted)' }}>
            {' '}
            24h
          </span>
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {fmtCompactUSD(coin.marketCap)} cap
        </span>
      </div>
    </button>
  );
}

export default function CoinGrid({ coins, selectedId, onSelect }) {
  return (
    <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
      {coins.map((c) => (
        <CoinCard key={c.id} coin={c} selected={c.id === selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
