export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Block admin areas (if any in future)
Disallow: /admin/
Disallow: /private/

# Block search results to prevent duplicate content
Disallow: /search?*
Disallow: /*?*

# Block API routes if any
Disallow: /api/

# Allow important files
Allow: /assets/
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml

# Sitemap location
Sitemap: https://prakashraj.info/sitemap.xml

# Crawl delay (optional, helps with server load)
Crawl-delay: 1`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
