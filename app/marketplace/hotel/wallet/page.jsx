'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet } from 'lucide-react';

export default function HotelWalletPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    fetch('/api/marketplace/hotel/wallet', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setWallet(d?.data?.wallet))
      .finally(() => setLoading(false));
  }, []);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num < 1) return;
    setRequesting(true);
    try {
      const res = await fetch('/api/marketplace/payout/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: num }),
      });
      const data = await res.json();
      if (data?.success) {
        setAmount('');
        const w = await fetch('/api/marketplace/hotel/wallet', { credentials: 'include' }).then((r) => r.json());
        setWallet(w?.data?.wallet);
      }
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <Wallet className="h-8 w-8 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">Total Earnings</p>
          <p className="text-2xl font-bold">₹ {(wallet?.totalEarnings ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-2xl font-bold">₹ {(wallet?.availableBalance ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Pending Withdrawal</p>
          <p className="text-2xl font-bold">₹ {(wallet?.pendingWithdrawals ?? 0).toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Withdrawn</p>
          <p className="text-2xl font-bold">₹ {(wallet?.totalWithdrawn ?? 0).toLocaleString()}</p>
        </Card>
      </div>
      <Card className="p-6 max-w-md">
        <h3 className="font-semibold mb-4">Request Payout</h3>
        <form onSubmit={handleRequestPayout} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" disabled={requesting || !amount || Number(amount) > (wallet?.availableBalance ?? 0)}>
            {requesting ? 'Requesting...' : 'Request Payout'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
