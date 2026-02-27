'use client';

import { useEffect, useRef } from 'react';

/** Calls POST /api/user/location once per session so admin can see user locations. No UI. */
export function UserLocationTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    fetch('/api/user/location', { method: 'POST', credentials: 'include' }).catch(() => {});
  }, []);

  return null;
}
