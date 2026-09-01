'use strict';

// Server-side Printful catalog gateway.
// The API key stays server-side (never shipped to the client).
// Without PRINTFUL_API_KEY set, returns { configured: false } so the storefront
// gracefully falls back to its built-in SVG previews — no fake inventory.

const PRINTFUL_BASE = 'https://api.printful.com';

async function resolveStoreId(apiKey) {
  // Explicit override wins (set PRINTFUL_STORE_ID if you have >1 store).
  if (process.env.PRINTFUL_STORE_ID) return process.env.PRINTFUL_STORE_ID;
  const res = await fetch(`${PRINTFUL_BASE}/stores`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`Printful /stores ${res.status}`);
  const data = await res.json();
  const stores = data.result || [];
  if (!stores.length) throw new Error('No Printful stores found for this key');
  // Prefer the first native store.
  return stores[0].id;
}

async function fetchProducts(apiKey) {
  const storeId = await resolveStoreId(apiKey);
  const res = await fetch(`${PRINTFUL_BASE}/sync/products?store_id=${storeId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Printful ${res.status}: ${body}`);
  }
  const data = await res.json();
  const products = (data.result || []).map((p) => {
    const outer = p.sync_product || p;
    return {
      id: outer.id,
      name: outer.name,
      href: outer.external_url || 'https://matchbybirth.printful.me',
      thumbnail: outer.thumbnail_url || null,
    };
  });
  return { storeId, products };
}

module.exports = async function printfulProducts(req, res) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    return res.json({ ok: true, configured: false });
  }
  try {
    const { storeId, products } = await fetchProducts(apiKey);
    return res.json({ ok: true, configured: true, storeId, products });
  } catch (err) {
    console.error('Printful products fetch failed:', err.message);
    // Don't fake a storefront — report the error, let the page fall back.
    return res.json({ ok: false, configured: true, error: err.message, products: [] });
  }
};
