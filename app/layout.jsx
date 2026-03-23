import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/layout/back-to-top';
import { UserLocationTracker } from '@/components/layout/user-location-tracker';
import { WhatsAppFloat } from '@/components/layout/whatsapp-float';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: 'Trips To Travels | Flights, Hotels & Tours - Best Price Guarantee',
  description: 'Book flights, hotels, and tours with Trips To Travels. Best prices, 24/7 support, and instant confirmation. Your trusted travel partner.',
  keywords: 'travel, flights, hotels, tours, booking, vacation, trips',
  icons: { icon: '/images/updatelogo.png' },
  openGraph: {
    title: 'Trips To Travels | Flights, Hotels & Tours',
    description: 'Book flights, hotels, and tours with the best price guarantee.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans bg-background text-foreground`}>
        <ThemeProvider defaultTheme="light" storageKey="trips-theme">
          {/* Meta Pixel (Facebook) - loads before the app becomes interactive */}
          <Script id="meta-pixel" strategy="beforeInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '3070170676515493');
fbq('track', 'PageView');`}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src="https://www.facebook.com/tr?id=3070170676515493&ev=PageView&noscript=1"
              alt=""
            />
          </noscript>
          <Navbar />
          <main className="min-h-screen bg-background">{children}</main>
          <Footer />
          <BackToTop />
          <WhatsAppFloat />
          <UserLocationTracker />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
