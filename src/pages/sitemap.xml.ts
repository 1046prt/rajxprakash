import { getCollection } from 'astro:content';

export async function GET() {
  const blogPosts = await getCollection('blog');
  const siteURL = 'https://prakashraj.info';

  // Static pages
  const staticPages = [
    {
      url: '',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '1.0',
    },
    {
      url: 'blog',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.9',
    },
  ];

  // Blog posts
  const blogPages = blogPosts.map((post) => {
    // Convert date to ISO string first, then create new Date
    const dateString =
      post.data.date instanceof Date
        ? post.data.date.toISOString()
        : new Date(post.data.date).toISOString();
    return {
      url: `blog/${post.slug}`,
      lastmod: new Date(dateString).toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8',
    };
  });

  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${siteURL}/${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
