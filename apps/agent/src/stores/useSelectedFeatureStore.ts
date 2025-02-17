import { create } from 'zustand';
import { FeatureSelectionDTOType } from '@meaku/core/types/webSocketData';

interface SelectedFeatureStore {
  isFirstSlideInDemoFlow: boolean;
  setFirstSlideInDemoFlow: (value: boolean) => void;
  selectedFeatures: FeatureSelectionDTOType[];
  setFeatures: (features: FeatureSelectionDTOType[]) => void;
}

const useSelectedFeatureStore = create<SelectedFeatureStore>((set) => ({
  isFirstSlideInDemoFlow: false,
  setFirstSlideInDemoFlow: (value) => set({ isFirstSlideInDemoFlow: value }),
  selectedFeatures: [],
  setFeatures: (features) => set({ selectedFeatures: [...features] }),
}));

export default useSelectedFeatureStore;
