import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/layout/back-to-top';
import { Toaster } from '@/components/ui/toaster';
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
  openGraph: {
    title: 'Trips To Travels | Flights, Hotels & Tours',
    description: 'Book flights, hotels, and tours with the best price guarantee.',
  },
};

const themeScript = `
(function(){
  try {
    var raw = localStorage.getItem('trips-site-theme');
    if (!raw) return;
    var data = JSON.parse(raw);
    var state = data && data.state;
    var id = state && state.themeId;
    var customThemes = (state && state.customThemes) || [];
    var builtIn = {
      default: { primary: '#c41e3a', background: '#f7f6f4', card: '#efede9', muted: '#e5e3de', border: '#d4d1ca' },
      ocean: { primary: '#0c7ab1', background: '#f2f5f9', card: '#e6ebf2', muted: '#d1dae8', border: '#a8bdd4' },
      forest: { primary: '#1a8f3a', background: '#f2f5f2', card: '#e6ebe6', muted: '#d1dcd1', border: '#a8bda8' },
      sunset: { primary: '#d97706', background: '#f8f5f1', card: '#f0ebe3', muted: '#e5d9cc', border: '#d4c2ab' },
      violet: { primary: '#6d28d9', background: '#f4f2f9', card: '#ebe7f4', muted: '#ddd4ea', border: '#c4b2d9' },
      rose: { primary: '#be185d', background: '#f8f4f5', card: '#f0e8eb', muted: '#e5d8dc', border: '#d4b8c0' }
    };
    var t = builtIn[id];
    if (!t && id && customThemes.length) {
      for (var i = 0; i < customThemes.length; i++) {
        if (customThemes[i].id === id) { t = customThemes[i]; break; }
      }
    }
    if (!t) t = builtIn.default;
    var r = document.documentElement;
    r.style.setProperty('--primary', t.primary);
    r.style.setProperty('--ring', t.primary);
    r.style.setProperty('--background', t.background);
    r.style.setProperty('--card', t.card);
    r.style.setProperty('--muted', t.muted);
    r.style.setProperty('--border', t.border);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider defaultTheme="light" storageKey="trips-theme">
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <BackToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
