'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowLeftRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const STATIONS = [
  { code: 'NDLS', name: 'New Delhi', sub: 'New Delhi Railway Station' },
  { code: 'Mumbai', name: 'Mumbai Central', sub: 'Mumbai Central' },
  { code: 'BLR', name: 'Bangalore', sub: 'Bangalore City Junction' },
  { code: 'MMCT', name: 'Mumbai CST', sub: 'Chhatrapati Shivaji Terminus' },
  { code: 'JP', name: 'Jaipur', sub: 'Jaipur Junction' },
  { code: 'ADI', name: 'Ahmedabad', sub: 'Ahmedabad Junction' },
  { code: 'MAS', name: 'Chennai', sub: 'Chennai Central' },
  { code: 'HYB', name: 'Hyderabad', sub: 'Secunderabad Junction' },
  { code: 'PNBE', name: 'Patna', sub: 'Patna Junction' },
  { code: 'KOAA', name: 'Kolkata', sub: 'Kolkata Howrah' },
];

const CLASSES = [
  { value: 'all', label: 'All Classes', sub: 'Any' },
  { value: '1a', label: '1A', sub: 'First AC' },
  { value: '2a', label: '2A', sub: 'Second AC' },
  { value: '3a', label: '3A', sub: 'Third AC' },
  { value: 'sl', label: 'SL', sub: 'Sleeper' },
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T12:00:00');
  return { main: `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}'${String(d.getFullYear()).slice(-2)}`, sub: DAY_NAMES[d.getDay()] };
}

export function TrainSearchWidget() {
  const router = useRouter();
  const [from, setFrom] = useState(STATIONS[0]);
  const [to, setTo] = useState(STATIONS[1]);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [trainClass, setTrainClass] = useState(CLASSES[0]);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showClass, setShowClass] = useState(false);

  const dateF = formatDate(date);

  const handleSwap = () => { setFrom(to); setTo(from); };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('from', from.code);
    params.set('to', to.code);
    params.set('date', date);
    router.push(`/train?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-5">
        <div className="relative">
          <Label className="text-xs font-medium text-muted-foreground">From</Label>
          <button type="button" onClick={() => { setShowFrom(true); setShowTo(false); setShowClass(false); }} className="mt-1 w-full text-left rounded-xl border border-border bg-background px-3 py-2.5 hover:border-primary/50 transition-colors">
            <p className="font-semibold text-foreground truncate">{from.name}</p>
            <p className="text-xs text-muted-foreground truncate">{from.sub}</p>
          </button>
          {showFrom && (
            <>
              <div className="absolute inset-0 z-10" aria-hidden onClick={() => setShowFrom(false)} />
              <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-600 shadow-xl py-1">
                {STATIONS.filter((s) => s.code !== to.code).map((s) => (
                  <li key={s.code}>
                    <button type="button" onClick={() => { setFrom(s); setShowFrom(false); }} className="w-full text-left px-3 py-2 hover:bg-muted">
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="relative flex items-end gap-1">
          <div className="relative flex-1">
            <Label className="text-xs font-medium text-muted-foreground">To</Label>
            <button type="button" onClick={() => { setShowTo(true); setShowFrom(false); setShowClass(false); }} className="mt-1 w-full text-left rounded-xl border border-border bg-background px-3 py-2.5 hover:border-primary/50 transition-colors">
              <p className="font-semibold text-foreground truncate">{to.name}</p>
              <p className="text-xs text-muted-foreground truncate">{to.sub}</p>
            </button>
            {showTo && (
              <>
                <div className="absolute inset-0 z-10" aria-hidden onClick={() => setShowTo(false)} />
                <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-600 shadow-xl py-1">
                  {STATIONS.filter((s) => s.code !== from.code).map((s) => (
                    <li key={s.code}>
                      <button type="button" onClick={() => { setTo(s); setShowTo(false); }} className="w-full text-left px-3 py-2 hover:bg-muted">
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.sub}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <button type="button" onClick={handleSwap} className="h-11 w-10 shrink-0 rounded-full border border-border bg-muted/50 hover:bg-muted flex items-center justify-center text-primary mb-0.5" aria-label="Swap">
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        <div>
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">Date <ChevronDown className="h-3 w-3 text-primary" /></Label>
          <label className="mt-1 flex flex-col rounded-xl border border-border bg-background px-3 py-2.5 cursor-pointer hover:border-primary/50 min-h-[52px]">
            <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} className="absolute opacity-0 w-0 h-0" />
            {dateF && <><span className="font-semibold text-foreground">{dateF.main}</span><span className="text-xs text-muted-foreground">{dateF.sub}</span></>}
          </label>
        </div>

        <div className="relative">
          <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">Class <ChevronDown className="h-3 w-3 text-primary" /></Label>
          <button type="button" onClick={() => { setShowClass(true); setShowFrom(false); setShowTo(false); }} className="mt-1 w-full text-left rounded-xl border border-border bg-background px-3 py-2.5 hover:border-primary/50 transition-colors">
            <p className="font-semibold text-foreground">{trainClass.label}</p>
            <p className="text-xs text-muted-foreground">{trainClass.sub}</p>
          </button>
          {showClass && (
            <>
              <div className="absolute inset-0 z-10" aria-hidden onClick={() => setShowClass(false)} />
              <ul className="absolute z-20 mt-1 w-full rounded-xl border-2 border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-600 shadow-xl py-1">
                {CLASSES.map((c) => (
                  <li key={c.value}>
                    <button type="button" onClick={() => { setTrainClass(c); setShowClass(false); }} className={cn('w-full text-left px-3 py-2 hover:bg-muted', trainClass.value === c.value && 'bg-primary/10')}>
                      <p className="font-medium text-foreground">{c.label}</p>
                      <p className="text-xs text-muted-foreground">{c.sub}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="flex items-end">
          <Button size="lg" className="w-full rounded-xl font-bold text-base h-[52px] bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSearch}>
            <Search className="h-5 w-5 mr-2" /> Search Trains
          </Button>
        </div>
      </div>
    </div>
  );
}
