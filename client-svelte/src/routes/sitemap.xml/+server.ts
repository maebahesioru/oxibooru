import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const pages = ['/', '/posts', '/tags', '/pools', '/comments', '/help'];
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `    <url><loc>${url.origin}${p}</loc></url>`).join('\n')}
</urlset>`;

    return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};