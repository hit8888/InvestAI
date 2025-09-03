import { useState, useCallback } from 'react';

interface UseCarouselProps {
  totalItems: number;
  itemsPerView?: number;
  initialIndex?: number;
}

interface UseCarouselReturn {
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  goToIndex: (index: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  totalPages: number;
  currentPage: number;
}

export const useCarousel = ({
  totalItems,
  itemsPerView = 1,
  initialIndex = 0,
}: UseCarouselProps): UseCarouselReturn => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const totalPages = Math.ceil(totalItems / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);

  // For carousels with multiple items per view, we can go next until we reach
  // the last item that can be the first item in a view
  const canGoNext = currentIndex < totalItems - itemsPerView;
  const canGoPrev = currentIndex > 0;

  const onNext = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canGoNext]);

  const onPrev = useCallback(() => {
    if (canGoPrev) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canGoPrev]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalItems) {
        setCurrentIndex(index);
      }
    },
    [totalItems],
  );

  return {
    currentIndex,
    onNext,
    onPrev,
    goToIndex,
    canGoNext,
    canGoPrev,
    totalPages,
    currentPage,
  };
};
