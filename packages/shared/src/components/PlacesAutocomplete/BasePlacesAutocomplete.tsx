import { Popover, PopoverContent, PopoverTrigger, LucideIcon, Input, cn } from '@neuraltrade/saral';
import { usePlacesAutocompleteState, PlaceData } from '../../hooks/usePlacesAutocompleteState';

export type { PlaceData };

export interface PlacesAutocompleteClasses {
  container?: string;
  inputWrapper?: string;
  input?: string;
  clearButton?: string;
  popoverContent?: string;
  predictionItem?: string;
}

export interface PlacesAutocompleteProps {
  className?: string;
  placeholder?: string;
  onPlaceSelect?: (place: PlaceData | null) => void;
  onBlur?: () => void;
  defaultValue?: string;
  requestOptions?: Partial<google.maps.places.AutocompletionRequest>;
  disabled?: boolean;
  portalContainer?: HTMLElement | null;
  classes?: PlacesAutocompleteClasses;
}

const PlacesAutocomplete = ({
  className,
  placeholder = 'Search for a place',
  onPlaceSelect,
  onBlur,
  defaultValue,
  requestOptions,
  disabled = false,
  portalContainer,
  classes,
}: PlacesAutocompleteProps) => {
  const {
    value,
    predictions,
    selectedIndex,
    isOpen,
    isInputDisabled,
    handleInputChange,
    handlePlaceSelect,
    handleKeyDown,
    clearInput,
    handleBlur,
    inputRef,
    canRender,
  } = usePlacesAutocompleteState({
    defaultValue,
    requestOptions,
    disabled,
    onPlaceSelect,
    onBlur,
  });

  if (!canRender) {
    return null;
  }

  return (
    <Popover open={isOpen}>
      <div className={cn('relative w-full', classes?.container)}>
        <div
          className={cn(
            'relative inline-flex h-10 w-full items-center justify-between gap-2 rounded-lg px-3 py-2',
            className,
          )}
        >
          <PopoverTrigger asChild>
            <div className={cn('relative flex-1 min-w-0', classes?.inputWrapper)}>
              <Input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={isInputDisabled}
                className={cn(
                  'h-auto border-0 bg-transparent p-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  classes?.input,
                )}
                autoComplete="off"
              />
            </div>
          </PopoverTrigger>

          {value && (
            <button
              type="button"
              aria-label="Clear input"
              onClick={clearInput}
              onMouseDown={(e) => e.preventDefault()}
              className={cn(
                'flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center hover:bg-gray-100 rounded',
                classes?.clearButton,
              )}
            >
              <LucideIcon name="x" className="text-gray-400" width="16" height="16" />
            </button>
          )}
        </div>

        <PopoverContent
          className={cn('w-80 max-h-96 overflow-y-auto p-0 pointer-events-auto', classes?.popoverContent)}
          align="start"
          side="bottom"
          sideOffset={4}
          onOpenAutoFocus={(e) => e.preventDefault()}
          portalContainer={portalContainer}
        >
          <div className="flex flex-col">
            {predictions.map((prediction, index) => (
              <button
                key={prediction.place_id}
                type="button"
                onClick={() => handlePlaceSelect(prediction)}
                onMouseDown={(e) => e.preventDefault()}
                className={cn(
                  'flex items-start gap-3 border-b border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 outline-none last:border-b-0',
                  selectedIndex === index && 'bg-gray-50',
                  classes?.predictionItem,
                )}
              >
                <LucideIcon name="map-pin" className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </div>
                  {prediction.structured_formatting.secondary_text && (
                    <div className="mt-0.5 text-sm text-gray-500 truncate">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default PlacesAutocomplete;
