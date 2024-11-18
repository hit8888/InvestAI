// apps/chatbot/src/hooks/useInView.ts
import { useEffect, useRef, useState } from 'react';

const useInView = (duration: number = 1000, once: boolean = false) => {
  const [isInView, setIsInView] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const hasBeenInView = useRef(false); // Cache map to track if it has ever been in view

  const callback = (entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      setIsVisible(true);
      // Start the timer when the element is in view
      timerRef.current = setTimeout(() => {
        setIsInView(true);
        hasBeenInView.current = true; // Mark as having been in view
      }, duration);
    } else {
      setIsVisible(false);
      // Clear the timer if the element is not in view
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (!once) {
        setIsInView(false);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback);
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [duration, once]);

  // If 'once' is true, return true if it has ever been in view
  return {
    isInView: once ? hasBeenInView.current : isInView,
    ref: targetRef,
    isVisible,
  };
};

export default useInView;
