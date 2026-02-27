'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const POPULAR_CITIES = [
  { id: 'goa', name: 'Goa', sub: 'Beaches & resorts' },
  { id: 'mumbai', name: 'Mumbai', sub: 'Maharashtra' },
  { id: 'delhi', name: 'Delhi', sub: 'NCR' },
  { id: 'bangalore', name: 'Bangalore', sub: 'Karnataka' },
  { id: 'jaipur', name: 'Jaipur', sub: 'Rajasthan' },
  { id: 'kerala', name: 'Kerala', sub: 'Backwaters & hills' },
  { id: 'udaipur', name: 'Udaipur', sub: 'Rajasthan' },
  { id: 'chennai', name: 'Chennai', sub: 'Tamil Nadu' },
  { id: 'hyderabad', name: 'Hyderabad', sub: 'Telangana' },
  { id: 'dubai', name: 'Dubai', sub: 'UAE' },
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T12:00:00');
  return {
    main: `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}'${String(d.getFullYear()).slice(-2)}`,
    sub: DAY_NAMES[d.getDay()],
  };
}

export function HotelSearchWidget() {
  const router = useRouter();
  const [city, setCity] = useState(POPULAR_CITIES[0]);
  const [checkIn, setCheckIn] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [showCity, setShowCity] = useState(false);
  const [showGuests, setShowGuests] = useState(false);

  const checkInF = formatDate(checkIn);
  const checkOutF = formatDate(checkOut);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('city', city.id);
    params.set('checkIn', checkIn);
    params.set('checkOut', checkOut);
    params.set('adults', String(guests));
    router.push(`/hotels?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-5">
        <div className="relative">
          <Label className="text-xs font-medium text-muted-foreground">Where</Label>
          <button
            type="button"
            onClick={() => { setShowCity(true); setShowGuests(false); }}
            className="mt-1 w-full text-left rounded-xl border border-border bg-background px-3 py-2.5 hover:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <p className="font-semibold text-foreground truncate">{city.name}</p>
            <p className="text-xs text-muted-foreground truncate">{city.sub}</p>
          </button>
          {showCity && (
            <>
              <div className="absolute inset-0 z-10" aria-hidden onClick={() => setShowCity(false)} />
              <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-600 shadow-xl py-1">
                {POPULAR_CITIES.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => { setCity(c); setShowCity(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-muted"
                    >
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.sub}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">Check-in <ChevronDown className="h-3 w-3 text-primary" /></Label>
          <label className="mt-1 flex flex-col rounded-xl border border-border bg-background px-3 py-2.5 cursor-pointer hover:border-primary/50 min-h-[52px]">
            <input type="date" value={checkIn} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setCheckIn(e.target.value)} className="absolute opacity-0 w-0 h-0" />
            {checkInF && <><span className="font-semibold text-foreground">{checkInF.main}</span><span className="text-xs text-muted-foreground">{checkInF.sub}</span></>}
          </label>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">Check-out <ChevronDown className="h-3 w-3 text-primary" /></Label>
          <label className="mt-1 flex flex-col rounded-xl border border-border bg-background px-3 py-2.5 cursor-pointer hover:border-primary/50 min-h-[52px]">
            <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="absolute opacity-0 w-0 h-0" />
            {checkOutF && <><span className="font-semibold text-foreground">{checkOutF.main}</span><span className="text-xs text-muted-foreground">{checkOutF.sub}</span></>}
          </label>
        </div>

        <div className="relative">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">Rooms & Guests <ChevronDown className="h-3 w-3 text-primary" /></Label>
          <button
            type="button"
            onClick={() => { setShowGuests(true); setShowCity(false); }}
            className="mt-1 w-full text-left rounded-xl border border-border bg-background px-3 py-2.5 hover:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors"
          >
            <p className="font-semibold text-foreground">{rooms} Room{rooms > 1 ? 's' : ''}, {guests} Guest{guests > 1 ? 's' : ''}</p>
            <p className="text-xs text-muted-foreground">Tap to change</p>
          </button>
          {showGuests && (
            <>
              <div className="absolute inset-0 z-10" aria-hidden onClick={() => setShowGuests(false)} />
              <div className="absolute z-20 right-0 mt-1 w-56 rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-600 shadow-xl p-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-sm font-medium">Rooms</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setRooms((n) => Math.max(1, n - 1))} className="h-8 w-8 rounded-lg border border-border hover:bg-muted">−</button>
                    <span className="w-6 text-center font-medium">{rooms}</span>
                    <button type="button" onClick={() => setRooms((n) => Math.min(5, n + 1))} className="h-8 w-8 rounded-lg border border-border hover:bg-muted">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">Guests</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setGuests((n) => Math.max(1, n - 1))} className="h-8 w-8 rounded-lg border border-border hover:bg-muted">−</button>
                    <span className="w-6 text-center font-medium">{guests}</span>
                    <button type="button" onClick={() => setGuests((n) => Math.min(9, n + 1))} className="h-8 w-8 rounded-lg border border-border hover:bg-muted">+</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-end">
          <Button size="lg" className="w-full rounded-xl font-bold text-base h-[52px] bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSearch}>
            <Search className="h-5 w-5 mr-2" /> Search Hotels
          </Button>
        </div>
      </div>
    </div>
  );
}
