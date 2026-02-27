'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const PILGRIMAGE_DESTINATIONS = [
  { id: 'chardham', name: 'Char Dham Yatra', sub: 'Yamunotri, Gangotri, Kedarnath, Badrinath' },
  { id: 'varanasi', name: 'Varanasi', sub: 'Kashi, spiritual capital' },
  { id: 'haridwar', name: 'Haridwar', sub: 'Ganga ghats, Har Ki Pauri' },
  { id: 'rishikesh', name: 'Rishikesh', sub: 'Yoga capital, temples' },
  { id: 'amarnath', name: 'Amarnath Yatra', sub: 'Holy cave, Jammu & Kashmir' },
  { id: 'vaishnodevi', name: 'Vaishno Devi', sub: 'Katra, Jammu' },
  { id: 'tirupati', name: 'Tirupati', sub: 'Balaji temple, Andhra Pradesh' },
  { id: 'sabarimala', name: 'Sabarimala', sub: 'Kerala' },
  { id: 'dwarka', name: 'Dwarka', sub: 'Gujarat' },
  { id: 'somnath', name: 'Somnath', sub: 'Gujarat' },
  { id: 'purijagannath', name: 'Puri Jagannath', sub: 'Odisha' },
  { id: 'rameshwaram', name: 'Rameshwaram', sub: 'Tamil Nadu' },
  { id: 'shirdi', name: 'Shirdi', sub: 'Sai Baba' },
  { id: 'ayodhya', name: 'Ayodhya', sub: 'Ram Mandir' },
  { id: 'mathura', name: 'Mathura-Vrindavan', sub: 'Krishna circuit' },
];

export function ReligionTourWidget() {
  const router = useRouter();
  const [destinationSearch, setDestinationSearch] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(PILGRIMAGE_DESTINATIONS[0]);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [tourDate, setTourDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  const today = new Date().toISOString().slice(0, 10);
  const filteredDestinations = useMemo(() => {
    if (!destinationSearch.trim()) return PILGRIMAGE_DESTINATIONS;
    const q = destinationSearch.toLowerCase().trim();
    return PILGRIMAGE_DESTINATIONS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sub && p.sub.toLowerCase().includes(q)) ||
        p.id.toLowerCase().includes(q)
    );
  }, [destinationSearch]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('type', 'pilgrimage');
    params.set('destination', selectedDestination.id);
    params.set('date', tourDate);
    router.push(`/tours?${params.toString()}`);
  };

  const displayDate = tourDate
    ? new Date(tourDate + 'T12:00:00').toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        weekday: 'short',
      })
    : 'Select date';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Label className="text-xs font-medium text-muted-foreground">Destination</Label>
          <div className="mt-1 relative">
            <input
              type="text"
              placeholder="Search Char Dham, Varanasi, Haridwar..."
              value={showDestinationDropdown ? destinationSearch : selectedDestination.name}
              onChange={(e) => {
                setDestinationSearch(e.target.value);
                setShowDestinationDropdown(true);
              }}
              onFocus={() => {
                setShowDestinationDropdown(true);
                setDestinationSearch('');
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          {showDestinationDropdown && (
            <>
              <div
                className="absolute inset-0 z-10"
                aria-hidden
                onClick={() => setShowDestinationDropdown(false)}
              />
              <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 shadow-xl py-1">
                {filteredDestinations.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-muted-foreground">No match</li>
                ) : (
                  filteredDestinations.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDestination(p);
                          setDestinationSearch('');
                          setShowDestinationDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-muted"
                      >
                        <p className="font-medium text-foreground">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sub}</p>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </>
          )}
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground">Tour date</Label>
          <div className="mt-1">
            <input
              type="date"
              value={tourDate}
              min={today}
              onChange={(e) => setTourDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm min-h-[42px]"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{displayDate}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleSearch}
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6"
        >
          <Search className="h-5 w-5 mr-2" />
          Search Religion Tours
        </Button>
      </div>
    </div>
  );
}
