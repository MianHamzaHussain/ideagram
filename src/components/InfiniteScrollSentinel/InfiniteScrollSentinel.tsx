import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollSentinelProps {
  /** Callback to trigger the next page fetch */
  onIntersect: () => void;
  /** Whether there is a next page available */
  hasNextPage: boolean;
  /** Whether the query is currently loading (to prevent multiple parallel triggers) */
  isLoading?: boolean;
  /** Custom height or styling for the trigger area */
  className?: string;
  /** Threshold for the observer (default 0.1) */
  threshold?: number;
}

/**
 * A reusable sentinel component for implementing infinite scroll.
 * Uses IntersectionObserver to trigger a callback when the component becomes visible.
 * Adheres to DRY principles and modern React standards.
 */
const InfiniteScrollSentinel = ({ 
  onIntersect, 
  hasNextPage, 
  isLoading,
  className = "h-4 w-full invisible", 
  threshold = 0.1
}: InfiniteScrollSentinelProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Memoize the intersection callback for stability in the observer
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isLoading) {
        onIntersect();
      }
    },
    [onIntersect, hasNextPage, isLoading]
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || (!hasNextPage && !isLoading)) return;

    const observer = new IntersectionObserver(handleIntersection, { threshold });
    observer.observe(element);

    return () => observer.disconnect();
  }, [hasNextPage, isLoading, handleIntersection, threshold]);

  return <div ref={sentinelRef} className={className} aria-hidden="true" />;
};

export default InfiniteScrollSentinel;
