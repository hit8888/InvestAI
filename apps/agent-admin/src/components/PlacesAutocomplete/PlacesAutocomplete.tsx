import { cn } from '@breakout/design-system/lib/cn';
import { BasePlacesAutocomplete, PlaceData } from '@neuraltrade/shared/components/PlacesAutocomplete';

export type { PlaceData };

interface PlacesAutocompleteProps {
  className?: string;
  placeholder?: string;
  onPlaceSelect?: (place: PlaceData | null) => void;
  onBlur?: () => void;
  defaultValue?: string;
  requestOptions?: Partial<google.maps.places.AutocompletionRequest>;
  disabled?: boolean;
}

const PlacesAutocomplete = ({
  className,
  placeholder = 'Search for a place',
  onPlaceSelect,
  onBlur,
  defaultValue,
  requestOptions,
  disabled = false,
}: PlacesAutocompleteProps) => {
  return (
    <BasePlacesAutocomplete
      className={cn('h-11 border border-gray-300 bg-white px-3 py-2 focus-within:border-gray-400', className)}
      placeholder={placeholder}
      onPlaceSelect={onPlaceSelect}
      onBlur={onBlur}
      defaultValue={defaultValue}
      requestOptions={requestOptions}
      disabled={disabled}
      classes={{
        inputWrapper: 'min-w-0 flex-1',
        input: 'h-auto rounded-none border-0 bg-transparent p-0 focus:border-0 focus:ring-0',
        popoverContent:
          'z-50 max-h-[384px] w-[350px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-0 shadow-md',
      }}
    />
  );
};

export default PlacesAutocomplete;
