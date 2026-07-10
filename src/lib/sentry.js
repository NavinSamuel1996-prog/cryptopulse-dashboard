import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;

export const hasSentry = Boolean(dsn);

export function initSentry() {
  if (!hasSentry) return;
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    tracesSampleRate: 0,
  });
}

export { Sentry };
