const BASE = '/api';

export async function sendContactMessage(data) {
  const res = await fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.errors?.[0]?.msg || 'Something went wrong.');
  }

  return res.json();
}
