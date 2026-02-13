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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider defaultTheme="light" storageKey="trips-theme">
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
