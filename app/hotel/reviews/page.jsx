'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function HotelReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/marketplace/hotel/register', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        const hotel = d?.data?.hotel;
        if (hotel?._id) {
          return fetch(`/api/marketplace/hotels/${hotel._id}/reviews`, { credentials: 'include' }).then((r) => r.json());
        }
        return { data: { reviews: [] } };
      })
      .then((d) => setReviews(d?.data?.reviews ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews</h1>
      {reviews.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">No reviews yet. Customers can leave reviews after their stay.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <Card key={r._id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{r.userId?.name ?? 'Guest'}</span>
                <span className="flex items-center gap-1 text-amber-600">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`h-4 w-4 ${i <= (r.rating ?? 0) ? 'fill-current' : ''}`} />
                  ))}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{r.comment}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
