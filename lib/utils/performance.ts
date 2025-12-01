// Debounce function - delays execution until after wait time has elapsed since last call
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, wait);
  };
}

// Throttle function - ensures function is called at most once per wait period
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= wait) {
      // Enough time has passed, call immediately
      lastCallTime = now;
      func(...args);
    } else {
      // Schedule a call for the remaining time
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(
        () => {
          lastCallTime = Date.now();
          func(...args);
          timeoutId = null;
        },
        wait - timeSinceLastCall
      );
    }
  };
}

// React hook for debounced values
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// React hook for throttled values
export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastUpdated, setLastUpdated] = useState<number>(() => Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated;

    if (timeSinceLastUpdate >= delay) {
      setThrottledValue(value);
      setLastUpdated(now);
    } else {
      const timeoutId = setTimeout(
        () => {
          setThrottledValue(value);
          setLastUpdated(Date.now());
        },
        delay - timeSinceLastUpdate
      );

      return () => clearTimeout(timeoutId);
    }
  }, [value, delay, lastUpdated]);

  return throttledValue;
}
