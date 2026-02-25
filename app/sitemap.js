const BASE = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://triptotravels.com';

export default function sitemap() {
  const staticPages = [
    '',
    '/flights',
    '/hotels',
    '/tours',
    '/packages',
    '/bus',
    '/train',
    '/cruise',
    '/cars',
    '/offers',
    '/contact',
    '/contact-us',
    '/about-us',
    '/privacy-policy',
    '/refund-policy',
    '/terms-and-conditions',
    '/login',
    '/signup',
    '/booking-summary',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : path.startsWith('/api') ? 'weekly' : 'weekly',
    priority: path === '' ? 1 : path === '/flights' || path === '/hotels' ? 0.9 : 0.8,
  }));

  return staticPages;
}
