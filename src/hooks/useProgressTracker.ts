import { useEffect, useRef } from 'react';
import { useAuth } from '../components/AuthProvider';
import { usePersonalization } from '../context/PersonalizationContext';
import { recordProgress } from '../services/personalizationApi';

/**
 * Tracks time spent on a chapter and reports to backend.
 * Uses IntersectionObserver to detect when the content is visible.
 */
export function useProgressTracker(chapterId: string, contentRef: React.RefObject<Element>) {
  const { user } = useAuth();
  const { profile } = usePersonalization();
  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);
  const completedRef = useRef(false);

  // Only track if user has a profile
  const shouldTrack = !!user && !!profile;

  useEffect(() => {
    if (!shouldTrack || !contentRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startTimeRef.current = Date.now();
        } else {
          if (startTimeRef.current !== null) {
            accumulatedRef.current += Math.round((Date.now() - startTimeRef.current) / 1000);
            startTimeRef.current = null;
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [shouldTrack, contentRef]);

  // Scroll-to-bottom detection for completion
  useEffect(() => {
    if (!shouldTrack) return;

    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (scrolledToBottom && !completedRef.current) {
        completedRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldTrack]);

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (!shouldTrack) return;
      // Add any remaining visible time
      if (startTimeRef.current !== null) {
        accumulatedRef.current += Math.round((Date.now() - startTimeRef.current) / 1000);
      }
      const timeSpent = accumulatedRef.current;
      if (timeSpent > 0) {
        recordProgress(chapterId, timeSpent, completedRef.current, user?.id).catch(() => {});
      }
    };
  }, [chapterId, shouldTrack, user]);
}
