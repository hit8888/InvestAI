import { useState, useCallback } from 'react';

interface UseCarouselProps {
  totalItems: number;
  itemsPerView?: number;
  initialIndex?: number;
  pageBased?: boolean; // New prop for page-based navigation
  itemsPerPage?: number; // Actual number of items displayed for item-based navigation
}

interface UseCarouselReturn {
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  goToIndex: (index: number) => void;
  goToPage: (page: number) => void; // New method for page navigation
  canGoNext: boolean;
  canGoPrev: boolean;
  totalPages: number;
  currentPage: number;
}

export const useCarousel = ({
  totalItems,
  itemsPerView = 1,
  initialIndex = 0,
  pageBased = false,
  itemsPerPage,
}: UseCarouselProps): UseCarouselReturn => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const totalPages = Math.ceil(totalItems / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);

  // Navigation logic depends on whether it's page-based or item-based
  const canGoNext = pageBased
    ? currentPage < totalPages - 1
    : currentIndex < totalItems - (itemsPerPage || itemsPerView);
  const canGoPrev = pageBased ? currentPage > 0 : currentIndex > 0;

  const onNext = useCallback(() => {
    if (canGoNext) {
      if (pageBased) {
        setCurrentIndex((prev) => Math.min(prev + itemsPerView, totalItems - 1));
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  }, [canGoNext, pageBased, itemsPerView, totalItems]);

  const onPrev = useCallback(() => {
    if (canGoPrev) {
      if (pageBased) {
        setCurrentIndex((prev) => Math.max(prev - itemsPerView, 0));
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  }, [canGoPrev, pageBased, itemsPerView]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalItems) {
        setCurrentIndex(index);
      }
    },
    [totalItems],
  );

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < totalPages) {
        setCurrentIndex(page * itemsPerView);
      }
    },
    [totalPages, itemsPerView],
  );

  return {
    currentIndex,
    onNext,
    onPrev,
    goToIndex,
    goToPage,
    canGoNext,
    canGoPrev,
    totalPages,
    currentPage,
  };
};
