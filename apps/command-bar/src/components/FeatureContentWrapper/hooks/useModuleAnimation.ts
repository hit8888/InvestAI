import { useEffect, useRef, useState } from 'react';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { ANIMATION_CONFIG } from '../constants';

/**
 * Custom hook for managing module animation and content loading
 *
 * Features:
 * - Deferred content loading for better animation performance
 * - Cleanup of animation frames on unmount
 *
 * @param activeFeature - The active module type
 * @returns Animation configuration and content loading state
 */
export const useModuleAnimation = (activeFeature: CommandBarModuleType | null) => {
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);

  // Defer heavy content loading until after animation starts
  useEffect(() => {
    if (activeFeature) {
      // Start animation immediately
      setShouldRenderContent(false);

      // Defer content rendering to next frame to prioritize animation
      animationFrameRef.current = requestAnimationFrame(() => {
        setShouldRenderContent(true);
      });
    } else {
      setShouldRenderContent(false);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeFeature]);

  return {
    shouldRenderContent,
    animationConfig: ANIMATION_CONFIG,
  };
};
