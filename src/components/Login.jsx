import { useState } from 'react';
import { sendMagicLink } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await sendMagicLink(email.trim());
      setStatus('sent');
    } catch (err) {
      const message = err.message || '';
      if (/signup/i.test(message)) {
        setError("This email doesn't have access yet. Ask the dashboard owner to add you, then try again.");
      } else {
        setError(message || 'Something went wrong sending the link.');
      }
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--page)' }}>
      <div
        className="w-full max-w-sm rounded-2xl border p-7"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
      >
        <h1 className="text-xl font-bold m-0" style={{ color: 'var(--text-primary)' }}>
          CryptoPulse
        </h1>
        <p className="text-sm mt-1.5 mb-5" style={{ color: 'var(--text-secondary)' }}>
          Sign in with a magic link — no password needed.
        </p>

        {status === 'sent' ? (
          <div
            className="rounded-xl border px-4 py-3 text-sm"
            style={{ color: 'var(--success-text)', borderColor: 'var(--border)', background: 'var(--page)' }}
          >
            Check <strong>{email}</strong> for a sign-in link. You can close this tab once you click it.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-sm rounded-lg border px-3 py-2.5 mb-3 outline-none"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
            />
            {status === 'error' && (
              <div className="text-xs mb-3" style={{ color: 'var(--critical)' }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full text-sm font-semibold rounded-lg py-2.5 cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--s1)', color: '#fff' }}
            >
              {status === 'sending' ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
