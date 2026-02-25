import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-foreground/90 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Page not found</h2>
        <p className="text-foreground/70 mb-8">
          The page you are looking for might have been removed or does not exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="rounded-xl gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" /> Home
            </Button>
          </Link>
          <Link href="/flights">
            <Button variant="outline" className="rounded-xl gap-2 w-full sm:w-auto">
              <Search className="h-4 w-4" /> Search Flights
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
