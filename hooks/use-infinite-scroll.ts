"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<PaginatedResponse<T>>;
  initialPage?: number;
  threshold?: number; // Distance from bottom to trigger load (in pixels)
}

interface UseInfiniteScrollReturn<T> {
  data: T[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  observerRef: (node: HTMLElement | null) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

export function useInfiniteScroll<T>({
  fetchFn,
  initialPage = 1,
  threshold = 200,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const currentPage = useRef(initialPage);
  const isFetching = useRef(false);

  const hasMore = pagination ? pagination.page < pagination.totalPages : false;

  const fetchData = useCallback(
    async (page: number, reset: boolean = false) => {
      if (isFetching.current) return;

      try {
        isFetching.current = true;

        if (reset) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        const response = await fetchFn(page);

        if (reset) {
          setData(response.data);
        } else {
          setData((prev) => [...prev, ...response.data]);
        }

        setPagination(response.pagination);
        currentPage.current = page;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
        setError(errorMessage);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetching.current = false;
      }
    },
    [fetchFn]
  );

  const loadMore = useCallback(() => {
    if (!hasMore || isFetching.current) return;
    fetchData(currentPage.current + 1, false);
  }, [hasMore, fetchData]);

  const reset = useCallback(() => {
    setData([]);
    setPagination(null);
    currentPage.current = initialPage;
    fetchData(initialPage, true);
  }, [fetchData, initialPage]);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isFetching.current) {
        loadMore();
      }
    },
    [hasMore, loadMore]
  );

  // Ref callback for the sentinel element
  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        observerRef.current = new IntersectionObserver(handleObserver, {
          rootMargin: `${threshold}px`,
        });
        observerRef.current.observe(node);
      }
    },
    [loading, handleObserver, threshold]
  );

  // Initial fetch
  useEffect(() => {
    fetchData(initialPage, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    data,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reset,
    observerRef: sentinelRef,
    pagination,
  };
}
