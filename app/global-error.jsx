'use client';

import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui', padding: '2rem', textAlign: 'center', background: '#0B1F3A', color: '#f1f5f9' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
        <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>A critical error occurred. Please try again.</p>
        <button
          type="button"
          onClick={() => reset()}
          style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#EAB308', color: '#1c1917' }}
        >
          Try again
        </button>
        <a href="/" style={{ color: '#94a3b8' }}>Go home</a>
      </body>
    </html>
  );
}
