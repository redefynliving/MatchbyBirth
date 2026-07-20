export async function requestCompatibilityResult(payload) {
  const response = await fetch('/api/calculate-result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Unable to calculate this result.');
  }

  return data;
}
