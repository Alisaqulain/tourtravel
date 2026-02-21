'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Fetch paginated travel list from API.
 * @param {string} category - flights | hotels | tours | bus | cruise | cars | visa | packages
 * @param {Record<string, string|number|boolean>} params - query params
 * @returns {{ data: any[], total: number, page: number, totalPages: number, loading: boolean, error: string | null, refetch: function }}
 */
export function useTravelList(category, params = {}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUrl = useCallback(() => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) search.set(k, String(v));
    });
    return `/api/travel/${category}?${search.toString()}`;
  }, [category, params]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(fetchUrl());
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Failed to load');
        setData([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }
      setData(json.data ?? []);
      setTotal(json.total ?? 0);
      setPage(json.page ?? 1);
      setTotalPages(json.totalPages ?? 1);
    } catch (e) {
      setError(e.message || 'Something went wrong');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, total, page, totalPages, loading, error, refetch };
}
