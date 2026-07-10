import { fmtTime } from '../lib/format';

export default function Header({ lastUpdated, onRefresh, refreshing, theme, onToggleTheme, userEmail, onSignOut }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-6 pt-8 pb-5">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight m-0" style={{ color: 'var(--text-primary)' }}>
          CryptoPulse
        </h1>
        <p className="mt-1.5 text-sm m-0" style={{ color: 'var(--text-secondary)' }}>
          Live market data — top 10 coins by market cap
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        {userEmail && (
          <span
            className="text-xs rounded-full px-3 py-2 border"
            style={{ color: 'var(--text-muted)', background: 'var(--surface-2)', borderColor: 'var(--border)' }}
          >
            {userEmail}
          </span>
        )}
        <span
          className="text-xs rounded-full px-3 py-2 border"
          style={{ color: 'var(--text-muted)', background: 'var(--surface-2)', borderColor: 'var(--border)' }}
        >
          {lastUpdated ? `Updated ${fmtTime(lastUpdated)}` : 'Loading…'}
        </span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="text-sm font-semibold rounded-full px-3.5 py-2 border cursor-pointer disabled:opacity-50"
          style={{ color: 'var(--text-secondary)', background: 'var(--surface-2)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
        >
          {refreshing ? 'Refreshing…' : '↻ Refresh'}
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="text-sm font-semibold rounded-full px-3.5 py-2 border cursor-pointer"
          style={{ color: 'var(--text-secondary)', background: 'var(--surface-2)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
        {userEmail && onSignOut && (
          <button
            type="button"
            onClick={onSignOut}
            className="text-sm font-semibold rounded-full px-3.5 py-2 border cursor-pointer"
            style={{ color: 'var(--text-secondary)', background: 'var(--surface-2)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}
