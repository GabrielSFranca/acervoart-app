/*
Next.js (App Router) - Example: fetch N obras from Tainacan (Acervo UFSM)

Files included in this snippet (paste into your Next.js project):

1) lib/tainacan.js
   - util server-side functions to fetch items from the Tainacan API and to parse each item
   - exports: fetchNItems({ collectionId, n, perpage, fetchImageSizes })

2) app/api/obras/route.js
   - a Next.js route handler (Edge/Node) that returns JSON with the requested N obras
   - query parameters: ?collection=2174&n=50&perpage=30&fetchImageSizes=1

Notes and assumptions (kept intentionally simple):
- We read fields directly where they exist (title, metadata entries). No heavy heuristics.
- Image extraction: we parse document_as_html for the first <img> and also pick a surrounding <a href> if present (often contains the full-size image).
- Stored dimensions: read width/height attributes from <img> if present.
- Real dimensions: optional. If fetchImageSizes=true, the code uses `probe-image-size` to probe the image stream for width/height without downloading whole file. Install dependency: `npm install probe-image-size cheerio`
- This code runs server-side (route.js). Don't import client-only libs.

How to use:
- Add `lib/tainacan.js` and `app/api/obras/route.js` to your project.
- `npm install probe-image-size cheerio` (only needed if you want real image sizes probing)
- Request: GET /api/obras?collection=2174&n=20&fetchImageSizes=1

--- START OF FILE: lib/tainacan.js ---
*/
const cheerio = require('cheerio');
let probe;
try {
  // optional dependency; will be available if installed
  probe = require('probe-image-size');
} catch (e) {
  probe = null;
}

const TAINCAN_BASE = process.env.TAINCAN_BASE || 'https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2';

function itemUrl(id) {
  return `${TAINCAN_BASE}/item/${id}`;
}
function collectionItemsUrl(collection = 2174, perpage = 30, page = 1) {
  return `${TAINCAN_BASE}/collection/${collection}/items?perpage=${perpage}&page=${page}`;
}

function extractFirstImageFromHtml(html) {
  if (!html) return { imageUrl: null, storedW: null, storedH: null };
  const $ = cheerio.load(html || '');
  const img = $('img').first();
  if (!img || img.length === 0) return { imageUrl: null, storedW: null, storedH: null };

  // prefer full-size URL if the <img> is wrapped in an <a href>
  const parentA = img.closest('a');
  const href = parentA && parentA.attr ? parentA.attr('href') : null;
  const src = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || null;

  const parseIntSafe = (v) => {
    if (!v) return null;
    const m = String(v).match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  };
  const storedW = parseIntSafe(img.attr('width') || img.attr('data-width') || img.attr('data-w'));
  const storedH = parseIntSafe(img.attr('height') || img.attr('data-height') || img.attr('data-h'));

  // choose href if present (often larger image), otherwise src
  const imageUrl = href || src;
  return { imageUrl, storedW, storedH };
}

async function probeImageSize(url, timeout = 10000) {
  if (!probe) return { width: null, height: null };
  if (!url) return { width: null, height: null };
  try {
    const res = await probe(url, { timeout });
    if (!res) return { width: null, height: null };
    return { width: res.width || null, height: res.height || null };
  } catch (e) {
    return { width: null, height: null };
  }
}

function normalizeAuthor(item) {
  // quick-access fields based on your JSON structure
  const meta = item.metadata || {};
  // example from your dump: metadata.taxonomia.value[0].name or metadata.taxonomia.value_as_string
  if (meta.taxonomia) {
    try {
      const t = meta.taxonomia;
      if (Array.isArray(t.value) && t.value.length) {
        const v0 = t.value[0];
        if (v0 && typeof v0 === 'object' && v0.name) return v0.name;
      }
      if (t.value_as_string) return t.value_as_string;
    } catch (e) {}
  }
  // fallback: common fields
  if (item.author_name) return item.author_name;
  if (item.authors && Array.isArray(item.authors) && item.authors.length) {
    const a0 = item.authors[0];
    if (typeof a0 === 'string') return a0;
    if (a0 && a0.name) return a0.name;
  }
  return null;
}

function normalizeTitle(item) {
  const meta = item.metadata || {};
  if (meta['titulo-6'] && meta['titulo-6'].value) return meta['titulo-6'].value;
  if (item.title) return item.title;
  return null;
}

function normalizeDate(item) {
  const meta = item.metadata || {};
  if (meta['data-da-obra-2']) {
    if (meta['data-da-obra-2'].value_as_string) return meta['data-da-obra-2'].value_as_string;
    if (meta['data-da-obra-2'].value) return meta['data-da-obra-2'].value;
  }
  if (item.creation_date) return item.creation_date;
  return null;
}

async function itemToMinimal(item, opts = { fetchRealImageSize: false }) {
  const title = normalizeTitle(item);
  const author = normalizeAuthor(item);
  const date = normalizeDate(item);

  const html = item.document_as_html || item.document_html || '';
  const { imageUrl, storedW, storedH } = extractFirstImageFromHtml(html);

  let real = { width: null, height: null };
  if (opts.fetchRealImageSize && imageUrl) {
    real = await probeImageSize(imageUrl);
  }

  return {
    id: item.id != null ? String(item.id) : null,
    title,
    author,
    date,
    image: imageUrl,
    image_stored_dimensions: (storedW || storedH) ? { width: storedW, height: storedH } : null,
    image_real_dimensions: (real.width || real.height) ? { width: real.width, height: real.height } : null
  };
}

async function fetchNItems({ collectionId = 2174, n = 20, perpage = 30, fetchRealImageSize = false }) {
  const out = [];
  let page = 1;
  while (out.length < n) {
    const url = collectionItemsUrl(collectionId, perpage, page);
    const res = await fetch(url);
    if (!res.ok) break;
    const data = await res.json();
    const batch = Array.isArray(data) ? data : (Array.isArray(data.items) ? data.items : []);
    if (!batch.length) break;
    for (const item of batch) {
      const minimal = await itemToMinimal(item, { fetchRealImageSize });
      out.push(minimal);
      if (out.length >= n) break;
    }
    if (batch.length < perpage) break;
    page += 1;
  }
  return out.slice(0, n);
}

module.exports = {
  fetchNItems,
  extractFirstImageFromHtml, // exported for tests or direct use
};


/* --- END OF lib/tainacan.js --- */


/* --- START OF FILE: app/api/obras/route.js --- */

// Next.js route handler (App Router) - place in app/api/obras/route.js
// Returns JSON array of minimal items. Server-side only.

const { fetchNItems: fetchNItemsLib } = require('../../../lib/tainacan');

/**
 * Example of a route handler for Next.js App Router.
 * - Accepts query params: collection, n, perpage, fetchReal
 */

// If you're using ESM route format, convert accordingly. This example uses CommonJS exports for clarity.

async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const collection = parseInt(url.searchParams.get('collection') || '') || 2174;
    const n = parseInt(url.searchParams.get('n') || '') || 20;
    const perpage = parseInt(url.searchParams.get('perpage') || '') || 30;
    const fetchReal = url.searchParams.get('fetchImageSizes') === '1' || url.searchParams.get('fetchImageSizes') === 'true';

    const items = await fetchNItemsLib({ collectionId: collection, n, perpage, fetchRealImageSize: fetchReal });
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(items));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: String(e) }));
  }
}

module.exports = handler;

/* --- END OF app/api/obras/route.js --- */


/*
Notes:
- If you use Next.js Route Handlers (app/api...), the handler signature is different (you export 'GET' function that returns a Response). Convert if needed:

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  // ... use fetchNItems and return new Response(JSON.stringify(items), { headers: {'Content-Type':'application/json'} })
}

- The code above is intentionally simple and synchronous-friendly. For production, add caching, retry policies and parallelization when probing many images.
*/
