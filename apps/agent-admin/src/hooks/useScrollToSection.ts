import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Reads the desired section id from location.state, query (?scrollTo=ID) or hash (#ID)
 * and smoothly scrolls to the corresponding element on mount/update.
 */
export function useScrollToSection(defaultOffsetPx: number = 0) {
  const location = useLocation();

  useEffect(() => {
    const stateId = (location.state as { scrollToId?: string; scrollOffset?: number } | null)?.scrollToId;
    const searchParams = new URLSearchParams(location.search);
    const queryId = searchParams.get('scrollTo') ?? undefined;
    const hashId = location.hash ? location.hash.replace('#', '') : undefined;
    const targetId = stateId || queryId || hashId;

    if (!targetId) return;

    const stateOffset = (location.state as { scrollOffset?: number } | null)?.scrollOffset;
    const queryOffset = searchParams.get('scrollOffset');
    const parsedQueryOffset = queryOffset ? Number(queryOffset) : undefined;
    const offsetPx = Number.isFinite(stateOffset as number)
      ? (stateOffset as number)
      : Number.isFinite(parsedQueryOffset as number)
        ? (parsedQueryOffset as number)
        : defaultOffsetPx;

    // Helper: find nearest scrollable ancestor
    const getScrollParent = (node: HTMLElement | null): HTMLElement | Window => {
      if (!node) return window;
      let current: HTMLElement | null = node.parentElement;
      while (current && current !== document.body) {
        const style = window.getComputedStyle(current);
        const overflowY = style.overflowY;
        const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
        if (isScrollable && current.scrollHeight > current.clientHeight) {
          return current;
        }
        current = current.parentElement;
      }
      return window;
    };

    // Attempt scroll with a few retries in case the element mounts slightly later
    let attempts = 0;
    const maxAttempts = 10;
    const attemptDelayMs = 100;

    const tryScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) {
        if (attempts < maxAttempts) {
          attempts += 1;
          window.setTimeout(tryScroll, attemptDelayMs);
        }
        return;
      }

      const scroller = getScrollParent(el);
      if (scroller === window) {
        const rect = el.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + rect.top;
        const targetTop = Math.max(absoluteTop - offsetPx, 0);
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      } else {
        const container = scroller as HTMLElement;
        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeTop = elRect.top - containerRect.top + container.scrollTop;
        const targetTop = Math.max(relativeTop - offsetPx, 0);
        container.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    };

    const timeout = window.setTimeout(tryScroll, 0);

    return () => window.clearTimeout(timeout);
  }, [location]);
}
