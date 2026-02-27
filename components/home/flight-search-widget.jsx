'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowLeftRight, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const POPULAR_AIRPORTS = [
  { city: 'Delhi', code: 'DEL', name: 'Delhi Airport India' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji International' },
  { city: 'Bangalore', code: 'BLR', name: 'Kempegowda International' },
  { city: 'Chennai', code: 'MAA', name: 'Chennai International' },
  { city: 'Hyderabad', code: 'HYD', name: 'Rajiv Gandhi International' },
  { city: 'Kolkata', code: 'CCU', name: 'Netaji Subhas Chandra Bose' },
  { city: 'Pune', code: 'PNQ', name: 'Pune Airport' },
  { city: 'Goa', code: 'GOI', name: 'Goa International' },
  { city: 'Kochi', code: 'COK', name: 'Cochin International' },
  { city: 'Ahmedabad', code: 'AMD', name: 'Sardar Vallabhbhai Patel' },
  { city: 'Jaipur', code: 'JAI', name: 'Jaipur International' },
  { city: 'Lucknow', code: 'LKO', name: 'Chaudhary Charan Singh' },
  { city: 'Chandigarh', code: 'IXC', name: 'Chandigarh International' },
  { city: 'Indore', code: 'IDR', name: 'Devi Ahilya Bai Holkar' },
  { city: 'Nagpur', code: 'NAG', name: 'Dr. Babasaheb Ambedkar' },
  { city: 'Dubai', code: 'DXB', name: 'Dubai International' },
  { city: 'Singapore', code: 'SIN', name: 'Singapore Changi' },
  { city: 'Bangkok', code: 'BKK', name: 'Suvarnabhumi' },
  { city: 'London', code: 'LHR', name: 'Heathrow' },
  { city: 'New York', code: 'JFK', name: 'John F. Kennedy' },
  { city: 'Maldives', code: 'MLE', name: 'Velana International' },
  { city: 'Sri Lanka', code: 'CMB', name: 'Bandaranaike Colombo' },
  { city: 'Kathmandu', code: 'KTM', name: 'Tribhuvan International' },
];

const TRIP_TYPES = [
  { value: 'oneway', label: 'Oneway' },
  { value: 'roundtrip', label: 'Round Trip' },
  { value: 'multicity', label: 'Multi City' },
];

const TRAVELLER_CLASSES = [
  { value: 'economy', label: 'Economy', sub: 'Economy/Premium Economy' },
  { value: 'business', label: 'Business', sub: 'Business Class' },
  { value: 'first', label: 'First', sub: 'First Class' },
];

const SPECIAL_FARES = [
  { id: 'regular', label: 'Regular', sub: 'Regular fares', active: true },
  { id: 'work', label: 'Travelling for work?', sub: 'Unlock Extra Savings & Benefits', tag: 'new' },
  { id: 'student', label: 'Student', sub: 'Extra discounts/baggage' },
  { id: 'armed', label: 'Armed Forces', sub: 'Up to ₹ 600 off' },
  { id: 'senior', label: 'Senior Citizen', sub: 'Up to ₹ 600 off' },
  { id: 'doctor', label: 'Doctor and Nurses', sub: 'Up to ₹ 600 off' },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDisplayDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDate();
  const month = MONTH_SHORT[d.getMonth()];
  const year = String(d.getFullYear()).slice(-2);
  const dayName = DAY_NAMES[d.getDay()];
  return { main: `${day} ${month}'${year}`, sub: dayName };
}

export function FlightSearchWidget({ onSearch, className, hideHeader }) {
  const router = useRouter();
  const [tripType, setTripType] = useState('oneway');
  const [from, setFrom] = useState(POPULAR_AIRPORTS[0]);
  const [to, setTo] = useState(POPULAR_AIRPORTS[1]);
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [specialFare, setSpecialFare] = useState('regular');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showTravellers, setShowTravellers] = useState(false);
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const fromFiltered = useMemo(() => {
    const list = POPULAR_AIRPORTS.filter((a) => a.code !== to.code);
    if (!fromSearch.trim()) return list;
    const q = fromSearch.toLowerCase().trim();
    return list.filter(
      (a) =>
        a.city.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    );
  }, [to.code, fromSearch]);
  const toFiltered = useMemo(() => {
    const list = POPULAR_AIRPORTS.filter((a) => a.code !== from.code);
    if (!toSearch.trim()) return list;
    const q = toSearch.toLowerCase().trim();
    return list.filter(
      (a) =>
        a.city.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q)
    );
  }, [from.code, toSearch]);

  const depDisplay = formatDisplayDate(departureDate);
  const returnDisplay = formatDisplayDate(returnDate);
  const cabinLabel = TRAVELLER_CLASSES.find((c) => c.value === cabinClass);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('origin', from.code);
    params.set('destination', to.code);
    params.set('date', departureDate);
    params.set('adults', String(travelers));
    if (tripType === 'roundtrip' && returnDate) params.set('returnDate', returnDate);
    const query = params.toString();
    if (onSearch) onSearch({ origin: from.code, destination: to.code, date: departureDate, adults: travelers, returnDate: returnDate || undefined });
    else router.push(`/flights?${query}`);
  };

  return (
    <div className={cn('w-full max-w-5xl mx-auto', className)}>
      {/* Orange header strip - Goibibo style (hidden when used in hero) */}
      {!hideHeader && (
        <div className="rounded-t-2xl bg-primary px-4 py-3 sm:py-4 text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-primary-foreground tracking-tight">
            Domestic and International Flights
          </h2>
        </div>
      )}

      {/* White card */}
      <div className={cn(
        'border border-border bg-card shadow-xl shadow-black/5 overflow-hidden',
        hideHeader ? 'rounded-2xl' : 'rounded-b-2xl'
      )}>
        <div className="p-4 sm:p-6">
          {/* Trip type: Oneway / Round Trip / Multi City */}
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <div className="flex items-center gap-4 sm:gap-6">
              {TRIP_TYPES.map((t) => (
                <label key={t.value} className="flex items-center gap-2 cursor-pointer group">
                  <span className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                    <input
                      type="radio"
                      name="tripType"
                      value={t.value}
                      checked={tripType === t.value}
                      onChange={() => setTripType(t.value)}
                      className="sr-only"
                    />
                    {tripType === t.value && (
                      <span className="absolute h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </span>
                  <span className={cn(
                    'text-sm font-medium transition-colors',
                    tripType === t.value ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                  )}>
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
              Book International and Domestic Flights
            </span>
          </div>

          {/* From / To / Departure / Return / Travellers - fixed min sizes to prevent overlap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(140px,1fr))] gap-3 sm:gap-4 mb-5">
            {/* From */}
            <div className="relative min-w-0">
              <Label className="text-xs font-medium text-muted-foreground">From</Label>
              <button
                type="button"
                onClick={() => { setShowFromDropdown(true); setShowToDropdown(false); setShowTravellers(false); }}
                className="mt-1 w-full min-h-[52px] text-left rounded-xl border border-border bg-background px-3 py-2.5 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              >
                <p className="font-semibold text-foreground truncate">{from.city}</p>
                <p className="text-xs text-muted-foreground truncate">{from.code}, {from.name}</p>
              </button>
              {showFromDropdown && (
                <>
                  <div className="absolute inset-0 z-10" aria-hidden onClick={() => setShowFromDropdown(false)} />
                  <div className="absolute z-20 mt-1 w-full rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-600 shadow-xl overflow-hidden">
                    <input
                      type="text"
                      placeholder="Search city or code..."
                      value={fromSearch}
                      onChange={(e) => setFromSearch(e.target.value)}
                      className="w-full px-3 py-2 border-b border-border text-sm"
                      autoFocus
                    />
                    <ul className="max-h-48 overflow-auto py-1">
                      {fromFiltered.map((a) => (
                        <li key={a.code}>
                          <button
                            type="button"
                            onClick={() => { setFrom(a); setShowFromDropdown(false); setFromSearch(''); }}
                            className="w-full text-left px-3 py-2 hover:bg-muted"
                          >
                            <p className="font-medium text-foreground">{a.city}</p>
                            <p className="text-xs text-muted-foreground">{a.code}, {a.name}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            {/* To (with swap) */}
            <div className="relative flex items-end gap-1 min-w-0">
              <div className="relative flex-1 min-w-0">
                <Label className="text-xs font-medium text-muted-foreground">To</Label>
                <button
                  type="button"
                  onClick={() => { setShowToDropdown(true); setShowFromDropdown(false); setShowTravellers(false); }}
                  className="mt-1 w-full min-h-[52px] text-left rounded-xl border border-border bg-background px-3 py-2.5 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                >
                  <p className="font-semibold text-foreground truncate">{to.city}</p>
                  <p className="text-xs text-muted-foreground truncate">{to.code}, {to.name}</p>
                </button>
                {showToDropdown && (
                  <>
                    <div className="absolute inset-0 z-10" aria-hidden onClick={() => setShowToDropdown(false)} />
                    <div className="absolute z-20 mt-1 w-full rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-600 shadow-xl overflow-hidden">
                      <input
                        type="text"
                        placeholder="Search city or code..."
                        value={toSearch}
                        onChange={(e) => setToSearch(e.target.value)}
                        className="w-full px-3 py-2 border-b border-border text-sm"
                        autoFocus
                      />
                      <ul className="max-h-48 overflow-auto py-1">
                        {toFiltered.map((a) => (
                          <li key={a.code}>
                            <button
                              type="button"
                              onClick={() => { setTo(a); setShowToDropdown(false); setToSearch(''); }}
                              className="w-full text-left px-3 py-2 hover:bg-muted"
                            >
                              <p className="font-medium text-foreground">{a.city}</p>
                              <p className="text-xs text-muted-foreground">{a.code}, {a.name}</p>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={handleSwap}
                className="h-11 w-10 shrink-0 rounded-full border border-border bg-muted/50 hover:bg-muted flex items-center justify-center text-primary mb-0.5"
                aria-label="Swap From and To"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </button>
            </div>

            {/* Departure - visible date input so picker opens and date is changeable */}
            <div className="min-w-0">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                Departure <ChevronDown className="h-3 w-3 text-primary" />
              </Label>
              <div className="mt-1 relative flex flex-col justify-center rounded-xl border border-border bg-background px-3 py-2 min-h-[52px]">
                <input
                  type="date"
                  value={departureDate}
                  min={today}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full text-sm font-semibold text-foreground bg-transparent border-0 p-0 focus:outline-none focus:ring-0 [color-scheme:light]"
                  title="Change departure date"
                />
                {depDisplay && (
                  <span className="text-xs text-muted-foreground">{depDisplay.sub}</span>
                )}
              </div>
            </div>

            {/* Return - visible date input when round trip so return date is changeable */}
            <div className="min-w-0">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                Return <ChevronDown className="h-3 w-3 text-primary" />
              </Label>
              {tripType === 'roundtrip' ? (
                <div className="mt-1 relative flex flex-col justify-center rounded-xl border border-border bg-background px-3 py-2 min-h-[52px]">
                  <input
                    type="date"
                    value={returnDate}
                    min={departureDate || today}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full text-sm font-semibold text-foreground bg-transparent border-0 p-0 focus:outline-none focus:ring-0 [color-scheme:light]"
                    title="Add or change return date"
                  />
                  {returnDisplay && (
                    <span className="text-xs text-muted-foreground">{returnDisplay.sub}</span>
                  )}
                  {!returnDate && (
                    <span className="text-xs text-muted-foreground">Click to add return date</span>
                  )}
                </div>
              ) : (
                <div className="mt-1 rounded-xl border border-border bg-muted/30 px-3 py-2.5 min-h-[52px] flex items-center">
                  <span className="text-xs text-muted-foreground">Add return date for round trip</span>
                </div>
              )}
            </div>

            {/* Travellers & Class */}
            <div className="relative min-w-0">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                Travellers & Class <ChevronDown className="h-3 w-3 text-primary" />
              </Label>
              <button
                type="button"
                onClick={() => { setShowTravellers(true); setShowFromDropdown(false); setShowToDropdown(false); }}
                className="mt-1 w-full min-h-[52px] text-left rounded-xl border border-border bg-background px-3 py-2.5 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              >
                <p className="font-semibold text-foreground">{travelers} Traveller{travelers > 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground">{cabinLabel?.sub}</p>
              </button>
              {showTravellers && (
                <>
                  <div className="absolute inset-0 z-10" aria-hidden onClick={() => setShowTravellers(false)} />
                  <div className="absolute z-20 right-0 mt-1 w-64 rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-600 shadow-xl p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Adults</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTravelers((n) => Math.max(1, n - 1))}
                            className="h-8 w-8 rounded-lg border border-border hover:bg-muted"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-medium">{travelers}</span>
                          <button
                            type="button"
                            onClick={() => setTravelers((n) => Math.min(9, n + 1))}
                            className="h-8 w-8 rounded-lg border border-border hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium block mb-2">Class</span>
                        <div className="space-y-1">
                          {TRAVELLER_CLASSES.map((c) => (
                            <label key={c.value} className="flex items-center gap-2 cursor-pointer py-1">
                              <input
                                type="radio"
                                name="cabin"
                                value={c.value}
                                checked={cabinClass === c.value}
                                onChange={() => setCabinClass(c.value)}
                                className="sr-only"
                              />
                              <span className={cn(
                                'flex h-4 w-4 items-center justify-center rounded border',
                                cabinClass === c.value ? 'border-primary bg-primary' : 'border-border'
                              )}>
                                {cabinClass === c.value && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                              </span>
                              <span className="text-sm">{c.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Special Fares */}
          <div className="mb-5">
            <p className="text-xs font-bold text-foreground/90 uppercase tracking-wide mb-2">Special Fares</p>
            <div className="flex flex-wrap gap-2">
              {SPECIAL_FARES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSpecialFare(f.id)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-left transition-colors',
                    specialFare === f.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/50 text-foreground'
                  )}
                >
                  <span className="text-sm font-medium flex items-center gap-1">
                    {f.label}
                    {f.tag && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400">{f.tag}</span>}
                  </span>
                  <span className="block text-xs text-muted-foreground">{f.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSearch}
              className="w-full sm:w-auto min-w-[200px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-6 px-8 shadow-lg"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
