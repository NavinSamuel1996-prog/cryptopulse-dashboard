import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { fmtPrice } from '../lib/format';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { ts, price } = payload[0].payload;
  const d = new Date(ts);
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs"
      style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
    >
      <div style={{ color: 'var(--text-secondary)' }}>
        {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}{' '}
        {d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
        {fmtPrice(price)}
      </div>
    </div>
  );
}

const RANGE_OPTIONS = [
  { key: 6, label: '6h' },
  { key: 24, label: '24h' },
  { key: 72, label: '3d' },
  { key: 168, label: '7d' },
  { key: null, label: 'All' },
];

export default function TrendChart({
  coinName,
  coinSymbol,
  points,
  loading,
  error,
  source,
  onSourceChange,
  showSourceToggle,
  rangeHours,
  onRangeChange,
}) {
  const [showTable, setShowTable] = useState(false);
  const resolvedColor = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--s1').trim() : '#2a78d6';

  const last = points && points.length ? points[points.length - 1] : null;
  const isShortRange = points && points.length > 1 && points[points.length - 1].ts - points[0].ts < 36 * 60 * 60 * 1000;

  const xTicks = useMemo(() => {
    if (!points || points.length === 0) return [];
    if (isShortRange) {
      const n = points.length;
      const step = Math.max(1, Math.floor(n / 6));
      const ticks = [];
      for (let i = 0; i < n; i += step) ticks.push(points[i].ts);
      if (ticks[ticks.length - 1] !== points[n - 1].ts) ticks.push(points[n - 1].ts);
      return ticks;
    }
    const seen = new Set();
    const ticks = [];
    points.forEach((p) => {
      const key = new Date(p.ts).toDateString();
      if (!seen.has(key)) {
        seen.add(key);
        ticks.push(p.ts);
      }
    });
    return ticks;
  }, [points, isShortRange]);

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
        <div>
          <h3 className="text-sm font-bold m-0" style={{ color: 'var(--text-primary)' }}>
            {coinName} ({coinSymbol}) —{' '}
            {source === 'supabase'
              ? `our tracked history (${RANGE_OPTIONS.find((r) => r.key === rangeHours)?.label || 'all'})`
              : '7 day price'}
          </h3>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {source === 'supabase'
              ? 'Source: our own price_snapshots table, collected every 15 min'
              : 'Source: CoinGecko market_chart, USD'}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showSourceToggle && (
            <div className="flex rounded-md border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
              {[
                { key: 'coingecko', label: 'CoinGecko · 7d' },
                { key: 'supabase', label: 'Our database' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onSourceChange(opt.key)}
                  className="text-[11px] font-semibold px-2.5 py-1 cursor-pointer"
                  style={{
                    color: source === opt.key ? '#fff' : 'var(--text-muted)',
                    background: source === opt.key ? 'var(--s1)' : 'transparent',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
          {!loading && !error && points && points.length >= 2 && (
            <button
              type="button"
              onClick={() => setShowTable((v) => !v)}
              className="text-[11px] font-semibold rounded-md border px-2.5 py-1 cursor-pointer shrink-0"
              style={{
                color: showTable ? 'var(--s1)' : 'var(--text-muted)',
                borderColor: showTable ? 'var(--s1)' : 'var(--border)',
              }}
            >
              {showTable ? 'View chart' : 'View table'}
            </button>
          )}
        </div>
      </div>

      {source === 'supabase' && (
        <div className="flex items-center gap-1.5 mb-3">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={String(opt.key)}
              type="button"
              onClick={() => onRangeChange(opt.key)}
              className="text-[11px] font-semibold rounded-full px-2.5 py-1 cursor-pointer border"
              style={{
                color: rangeHours === opt.key ? '#fff' : 'var(--text-muted)',
                background: rangeHours === opt.key ? 'var(--s2)' : 'transparent',
                borderColor: rangeHours === opt.key ? 'var(--s2)' : 'var(--border)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="h-72 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading chart…
        </div>
      )}

      {error && !loading && (
        <div className="h-72 flex items-center justify-center text-sm text-center px-6" style={{ color: 'var(--critical)' }}>
          {error}
        </div>
      )}

      {!loading && !error && points && points.length < 2 && (
        <div className="h-72 flex items-center justify-center text-sm text-center px-6" style={{ color: 'var(--text-muted)' }}>
          {source === 'supabase'
            ? 'Still collecting — our tracker snapshots prices every 15 minutes, check back shortly for a real trend line.'
            : 'No data available.'}
        </div>
      )}

      {!loading && !error && points && points.length >= 2 && !showTable && (
        <div className="h-72 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 10, right: 88, bottom: 4, left: 4 }}>
              <CartesianGrid stroke="var(--grid)" vertical={false} />
              <XAxis
                dataKey="ts"
                type="number"
                domain={['dataMin', 'dataMax']}
                ticks={xTicks}
                tickFormatter={(ts) =>
                  isShortRange
                    ? new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
                    : new Date(ts).toLocaleDateString(undefined, { weekday: 'short' })
                }
                stroke="var(--baseline)"
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(v) => fmtPrice(v)}
                stroke="var(--baseline)"
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                tickLine={false}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--baseline)', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={resolvedColor}
                strokeWidth={2}
                fill={resolvedColor}
                fillOpacity={0.1}
                dot={false}
                activeDot={{ r: 5, stroke: 'var(--surface-1)', strokeWidth: 2 }}
                isAnimationActive={false}
              />
              {last && (
                <ReferenceDot
                  x={last.ts}
                  y={last.price}
                  r={4}
                  fill={resolvedColor}
                  stroke="var(--surface-1)"
                  strokeWidth={2}
                  label={{ value: fmtPrice(last.price), position: 'right', fill: 'var(--text-primary)', fontSize: 12, fontWeight: 700 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && !error && points && points.length >= 2 && showTable && (
        <div className="mt-3 max-h-72 overflow-auto">
          <table className="w-full text-xs" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th className="text-left py-1.5 px-2 sticky top-0" style={{ color: 'var(--text-muted)', background: 'var(--surface-1)' }}>
                  Time
                </th>
                <th className="text-right py-1.5 px-2 sticky top-0" style={{ color: 'var(--text-muted)', background: 'var(--surface-1)' }}>
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {points
                .filter((_, i) => i % Math.max(1, Math.ceil(points.length / 50)) === 0)
                .map((p) => (
                  <tr key={p.ts} style={{ borderTop: '1px solid var(--grid)' }}>
                    <td className="py-1.5 px-2" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(p.ts).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-1.5 px-2 text-right font-semibold" style={{ color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                      {fmtPrice(p.price)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
