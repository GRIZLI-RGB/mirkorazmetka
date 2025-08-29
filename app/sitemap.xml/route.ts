import { NextResponse } from 'next/server';

const companies = [
  { slug: 'sgroshi', updatedAt: new Date().toISOString().split('T')[0] }, // Сьогоднішня дата
  { slug: 'credit7', updatedAt: '2025-06-21' },
];

const staticPages = [
  { url: '', lastmod: new Date().toISOString().split('T')[0], priority: 1.0, changefreq: 'daily' }, // Головна сторінка
  { url: 'contacts', lastmod: new Date().toISOString().split('T')[0], priority: 0.9, changefreq: 'weekly' },
  { url: 'reviews', lastmod: '2025-06-20', priority: 0.7, changefreq: 'monthly' },
  { url: 'loan', lastmod: new Date().toISOString().split('T')[0], priority: 0.8, changefreq: 'weekly' },
  { url: 'about', lastmod: '2025-06-15', priority: 0.6, changefreq: 'monthly' },
  { url: 'mfo', lastmod: new Date().toISOString().split('T')[0], priority: 0.85, changefreq: 'weekly' },
];

function generateUrl(url: string, lastmod: string, priority: number, changefreq: string) {
  return `
    <url>
      <loc>https://mfoxa.com.ua/${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority.toFixed(1)}</priority>
    </url>
  `;
}

export async function GET() {
  const staticUrls = staticPages.map((p) => generateUrl(p.url, p.lastmod, p.priority, p.changefreq)).join('');
  const dynamicUrls = companies
    .map(
      (company) => `
    <url>
      <loc>https://mfoxa.com.ua/mfo/${company.slug}</loc>
      <lastmod>${company.updatedAt}</lastmod>
      <changefreq>${company.slug === 'sgroshi' ? 'daily' : 'weekly'}</changefreq>
      <priority>0.8</priority>
    </url>
  `
    )
    .join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${dynamicUrls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=59',
    },
  });
}