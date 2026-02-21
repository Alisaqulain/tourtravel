/** @type {import('next').MetadataRoute.Robots} */
export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tripstotravels.com';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/profile', '/my-bookings', '/payment', '/booking-summary'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
