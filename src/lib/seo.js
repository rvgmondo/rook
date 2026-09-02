// Structured data (JSON-LD), sitemap and robots. Kept in one place so the
// canonical host and the URL list have a single source of truth.

import { products, price } from '../data/products.js';
import { articles } from '../data/journal.js';
import { home } from '../data/copy.js';

export const SITE = 'https://rookvapes.co.za';

const script = (obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;

export function organizationLd() {
  return script({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ROOK',
    url: SITE + '/',
    logo: SITE + '/img/logo-fav.png',
    description: 'A South African vape brand. Nicotine salt e-liquid, blended in Gauteng.',
    sameAs: ['https://www.instagram.com/rook.vapes', 'https://www.tiktok.com/@rook.vapes'],
    email: 'hello@rookvapes.co.za',
    areaServed: 'ZA',
  });
}

export function websiteLd() {
  return script({
    '@context': 'https://schema.org', '@type': 'WebSite',
    name: 'ROOK', url: SITE + '/', inLanguage: 'en-ZA',
  });
}

export function faqLd(faqs) {
  return script({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  });
}

export function breadcrumbLd(items) {
  return script({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name,
      item: it.url ? SITE + it.url : undefined,
    })),
  });
}

export function productLd(p) {
  return script({
    '@context': 'https://schema.org', '@type': 'Product',
    name: `ROOK ${p.name}`,
    description: p.short,
    brand: { '@type': 'Brand', name: 'ROOK' },
    category: 'Nicotine salt e-liquid',
    offers: {
      '@type': 'Offer', priceCurrency: 'ZAR', price: String(price),
      availability: 'https://schema.org/PreOrder',
      url: `${SITE}/product/${p.slug}/`,
    },
  });
}

// --- sitemap + robots --------------------------------------------------------
export function sitemapXml() {
  const urls = [
    '/', '/shop/', '/flavours/', '/about/', '/help/', '/contact/',
    '/wholesale/', '/age-policy/', '/terms/', '/privacy/', '/journal/',
    ...products.map((p) => `/product/${p.slug}/`),
    ...articles.map((a) => `/journal/${a.slug}/`),
  ];
  const body = urls.map((u) =>
    `  <url><loc>${SITE}${u}</loc><changefreq>weekly</changefreq></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function robotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`;
}
