import { usePopoverPortal } from '../../hooks/usePortal';
import PlacesAutocomplete, { PlaceData } from './BasePlacesAutocomplete';
import type { PlacesAutocompleteProps } from './BasePlacesAutocomplete';

type PlacesAutocompleteContainerProps = Omit<PlacesAutocompleteProps, 'portalContainer'>;

const PlacesAutocompleteContainer = (props: PlacesAutocompleteContainerProps) => {
  const { portalContainer } = usePopoverPortal();

  return <PlacesAutocomplete {...props} portalContainer={portalContainer} />;
};

export default PlacesAutocompleteContainer;
export type { PlaceData };
