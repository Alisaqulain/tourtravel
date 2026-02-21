/**
 * SEO helpers: metadata and JSON-LD for detail pages.
 */

const SITE_NAME = 'Trips To Travels';
const DEFAULT_DESC = 'Book flights, hotels, and tours with Trips To Travels. Best prices, 24/7 support, and instant confirmation.';

/**
 * @param {{ title: string, description?: string, image?: string, path?: string, type?: string }} opts
 */
export function buildMetadata(opts = {}) {
  const title = opts.title ? `${opts.title} | ${SITE_NAME}` : `${SITE_NAME} | Flights, Hotels & Tours`;
  const description = opts.description || DEFAULT_DESC;
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tripstotravels.com';
  const url = opts.path ? `${base}${opts.path}` : base;
  const image = opts.image || `${base}/images/Trip%20Logo.png`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image }],
      type: opts.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: opts.path ? { canonical: url } : undefined,
  };
}

/**
 * JSON-LD for a single product/offer (e.g. flight or hotel).
 */
export function productJsonLd({ name, description, image, price, currency = 'INR', url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image || undefined,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      url,
    },
  };
}

/**
 * Breadcrumb JSON-LD.
 * @param {Array<{ name: string, href: string }>} items
 */
export function breadcrumbJsonLd(items) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://tripstotravels.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.href.startsWith('http') ? item.href : `${base}${item.href}`,
    })),
  };
}
