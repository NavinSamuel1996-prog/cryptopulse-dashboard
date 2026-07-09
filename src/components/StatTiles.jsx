import { fmtCompactUSD, fmtPct } from '../lib/format';

function Tile({ label, value, deltaLabel, deltaDir }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
    >
      <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
      <div className="text-2xl font-bold mt-1.5 tracking-tight" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      {deltaLabel && (
        <div
          className="text-xs font-semibold mt-1.5"
          style={{ color: deltaDir === 'up' ? 'var(--success-text)' : deltaDir === 'down' ? 'var(--critical)' : 'var(--text-muted)' }}
        >
          {deltaDir === 'up' ? '▲ ' : deltaDir === 'down' ? '▼ ' : ''}
          {deltaLabel}
        </div>
      )}
    </div>
  );
}

export default function StatTiles({ coins }) {
  if (!coins || coins.length === 0) return null;
  const totalCap = coins.reduce((a, c) => a + (c.marketCap || 0), 0);
  const avgChange = coins.reduce((a, c) => a + (c.change24h || 0), 0) / coins.length;
  const best = coins.reduce((a, c) => (c.change24h > (a?.change24h ?? -Infinity) ? c : a), null);
  const worst = coins.reduce((a, c) => (c.change24h < (a?.change24h ?? Infinity) ? c : a), null);

  return (
    <div className="grid gap-3.5 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
      <Tile label="Combined market cap (top 10)" value={fmtCompactUSD(totalCap)} />
      <Tile
        label="Average 24h change"
        value={fmtPct(avgChange)}
        deltaLabel="across top 10"
        deltaDir={avgChange >= 0 ? 'up' : 'down'}
      />
      <Tile label="Best 24h performer" value={`${best.symbol} ${fmtPct(best.change24h)}`} deltaLabel={best.name} deltaDir="up" />
      <Tile label="Worst 24h performer" value={`${worst.symbol} ${fmtPct(worst.change24h)}`} deltaLabel={worst.name} deltaDir="down" />
    </div>
  );
}
