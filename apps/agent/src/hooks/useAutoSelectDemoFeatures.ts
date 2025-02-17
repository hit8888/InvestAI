import { FeatureSelectionDTOType } from '@meaku/core/types/webSocketData';
import { useEffect, useState } from 'react';

// when the demoFeatures length is less than or equal to 2 then only auto select features.
// Otherwise, don't autoselect options and take explicit input from user!
// If feature > 2 ——> No default selection , user have to select at least one of the features,
// Start Demo Button would be disabled and A tooltip would appear when hovered saying - "Please select features to start demo"

const useAutoSelectDemoFeatures = (demoFeatures: FeatureSelectionDTOType[]) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (demoFeatures.length > 0 && demoFeatures.length <= 2) {
      setSelectedIds(demoFeatures.map((item) => item.id));
    }
  }, [demoFeatures]);

  return { selectedIds, setSelectedIds };
};

export default useAutoSelectDemoFeatures;
