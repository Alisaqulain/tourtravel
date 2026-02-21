/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tripstotravels.com';
  const staticRoutes = [
    '', '/about', '/contact', '/flights', '/hotels', '/tours', '/bus', '/cruise', '/cars', '/visa', '/packages', '/offers',
    '/login', '/signup', '/terms', '/privacy', '/cancellation',
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));
  return staticRoutes;
}
