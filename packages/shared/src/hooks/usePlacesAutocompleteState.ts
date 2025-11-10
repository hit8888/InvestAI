import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BLUR_TIMEOUT_MS = 200;

export interface PlaceData {
  description: string;
  placeId: string;
  prediction: google.maps.places.AutocompletePrediction;
}

interface UsePlacesAutocompleteStateProps {
  defaultValue?: string;
  requestOptions?: Partial<google.maps.places.AutocompletionRequest>;
  disabled?: boolean;
  onPlaceSelect?: (place: PlaceData | null) => void;
  onBlur?: () => void;
  debounce?: number;
}

interface UsePlacesAutocompleteStateReturn {
  // State
  value: string;
  predictions: google.maps.places.AutocompletePrediction[];
  selectedIndex: number;
  isOpen: boolean;
  isReady: boolean;
  isInputDisabled: boolean;
  status: string;
  canRender: boolean;

  // Handlers
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePlaceSelect: (prediction: google.maps.places.AutocompletePrediction) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  clearInput: () => void;
  handleBlur: () => void;

  // Utilities
  inputRef: React.RefObject<HTMLInputElement | null>;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
}

/**
 * Custom hook for Google Maps script loading
 */
const useGoogleMapsScript = () => {
  const [isReady, setIsReady] = useState(() => !!window.google?.maps?.places);

  useEffect(() => {
    // Check if API key is available
    if (!GOOGLE_MAPS_API_KEY) {
      console.warn('Google Maps API key is not configured. Set VITE_GOOGLE_MAPS_API_KEY environment variable.');
      return;
    }

    if (isReady) return;

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      const MAX_POLLING_TIME = 10000; // 10 seconds timeout
      const POLLING_INTERVAL = 100; // Check every 100ms
      const startTime = Date.now();
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      const checkReady = () => {
        if (window.google?.maps?.places) {
          setIsReady(true);
          return;
        }

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= MAX_POLLING_TIME) {
          // Timeout reached - stop polling
          console.warn('Google Maps script failed to load within timeout period');
          return;
        }

        timeoutId = setTimeout(checkReady, POLLING_INTERVAL);
      };

      checkReady();

      // Cleanup function to clear timeout if component unmounts
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }

    // Load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsReady(true);
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      // Don't set isReady to true on error - let the component handle the disabled state
    };
    document.head.appendChild(script);
  }, [isReady]);

  return isReady;
};

/**
 * UI-agnostic hook for managing Google Places Autocomplete state and logic
 * Provides all necessary state and handlers for building custom autocomplete UI components
 */
export const usePlacesAutocompleteState = ({
  defaultValue,
  requestOptions,
  disabled = false,
  onPlaceSelect,
  onBlur,
  debounce = 300,
}: UsePlacesAutocompleteStateProps = {}): UsePlacesAutocompleteStateReturn => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const isScriptReady = useGoogleMapsScript();

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init,
  } = usePlacesAutocomplete({
    requestOptions,
    debounce,
    defaultValue: defaultValue || '',
    initOnMount: false,
  });

  // Derived state
  const predictions = useMemo(() => (status === 'OK' ? data : []), [status, data]);
  const isOpen = predictions.length > 0;
  const isInputDisabled = disabled || !ready || !isScriptReady;

  useEffect(() => {
    if (isScriptReady) {
      init();
    }
  }, [isScriptReady, init]);

  // Set default value when it changes externally
  useEffect(() => {
    if (defaultValue && defaultValue !== value) {
      setValue(defaultValue, false);
    }
  }, [defaultValue, setValue, value]);

  const handlePlaceSelect = useCallback(
    (prediction: google.maps.places.AutocompletePrediction) => {
      // No additional API calls - just use the prediction data we already have
      setValue(prediction.description, false);
      clearSuggestions();
      setSelectedIndex(-1);

      const placeData: PlaceData = {
        description: prediction.description,
        placeId: prediction.place_id,
        prediction, // Pass the full prediction object so parent can extract what they need
      };

      onPlaceSelect?.(placeData);
    },
    [setValue, clearSuggestions, onPlaceSelect],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setSelectedIndex(-1);

      if (!newValue) {
        onPlaceSelect?.(null);
        clearSuggestions();
      }
    },
    [setValue, onPlaceSelect, clearSuggestions],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!predictions.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, predictions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            e.preventDefault();
            handlePlaceSelect(predictions[selectedIndex]);
          }
          break;
        case 'Escape':
          clearSuggestions();
          setSelectedIndex(-1);
          break;
      }
    },
    [predictions, selectedIndex, handlePlaceSelect, clearSuggestions],
  );

  const clearInput = useCallback(() => {
    setValue('', false);
    onPlaceSelect?.(null);
    clearSuggestions();
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, [setValue, onPlaceSelect, clearSuggestions]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      clearSuggestions();
      onBlur?.();
    }, BLUR_TIMEOUT_MS);
  }, [clearSuggestions, onBlur]);

  return {
    // State
    value,
    predictions,
    selectedIndex,
    isOpen,
    isReady: ready && isScriptReady,
    isInputDisabled,
    status,
    canRender: !!GOOGLE_MAPS_API_KEY,

    // Handlers
    handleInputChange,
    handlePlaceSelect,
    handleKeyDown,
    clearInput,
    handleBlur,

    // Utilities
    inputRef,
    setSelectedIndex,
  };
};
