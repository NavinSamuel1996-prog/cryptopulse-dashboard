export function fmtPrice(n) {
  if (n == null) return '—';
  if (n >= 1) return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  return '$' + n.toPrecision(4);
}

export function fmtCompactUSD(n) {
  if (n == null) return '—';
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 1e12) return sign + '$' + (a / 1e12).toFixed(2) + 'T';
  if (a >= 1e9) return sign + '$' + (a / 1e9).toFixed(2) + 'B';
  if (a >= 1e6) return sign + '$' + (a / 1e6).toFixed(2) + 'M';
  if (a >= 1e3) return sign + '$' + (a / 1e3).toFixed(1) + 'K';
  return sign + '$' + a.toFixed(0);
}

export function fmtPct(n, digits = 2) {
  if (n == null) return '—';
  return (n > 0 ? '+' : '') + n.toFixed(digits) + '%';
}

export function fmtTime(date) {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
