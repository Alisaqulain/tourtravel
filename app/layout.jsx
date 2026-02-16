import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
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
      default: { primary: '#E50914', background: '#0B1F3A', card: '#0f2744', muted: '#1e3a5f', border: '#1e3a5f' },
      ocean: { primary: '#0ea5e9', background: '#0c2438', card: '#0f3147', muted: '#1e3d52', border: '#1e3d52' },
      forest: { primary: '#22c55e', background: '#0d2818', card: '#0f3520', muted: '#1e4a2e', border: '#1e4a2e' },
      sunset: { primary: '#f97316', background: '#2d1f0c', card: '#3d2a0f', muted: '#5f421e', border: '#5f421e' },
      violet: { primary: '#8b5cf6', background: '#1e1a2e', card: '#2a2440', muted: '#3d3555', border: '#3d3555' },
      rose: { primary: '#f43f5e', background: '#2e0f18', card: '#3d1520', muted: '#5f1e2e', border: '#5f1e2e' }
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider defaultTheme="dark" storageKey="trips-theme">
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
