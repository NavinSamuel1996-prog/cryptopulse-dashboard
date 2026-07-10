import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initSentry, Sentry, hasSentry } from './lib/sentry'

initSentry();

function ErrorFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        color: '#898781',
      }}
    >
      Something went wrong. Please refresh the page.
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {hasSentry ? (
      <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
        <App />
      </Sentry.ErrorBoundary>
    ) : (
      <App />
    )}
  </StrictMode>,
)
