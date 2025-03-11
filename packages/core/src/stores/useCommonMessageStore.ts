import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { DemoPlayingStatus } from '@meaku/core/types/common';

interface State {
  latestResponseId: string;
  setLatestResponseId: (latestResponseId: string) => void;
  isAMessageBeingProcessed: false | true;
  setIsAMessageBeingProcessed: (isAMessageBeingProcessed: boolean) => void;
  hasFirstUserMessageBeenSent: boolean;
  setHasFirstUserMessageBeenSent: (value: boolean) => void;
  orbState: OrbStatusEnum;
  handleUpdateOrbState: (selectedOrbState: OrbStatusEnum) => void;
  isMediaTakingFullWidth: boolean;
  handleToggleFullScreen: () => void;
  setMediaTakeFullScreenWidth: (value: boolean | ((prevState: boolean) => boolean)) => void;
  demoPlayingStatus: DemoPlayingStatus;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
}

export const useCommonMessageStore = create<State>()(
  devtools(
    immer((set) => ({
      latestResponseId: '',
      setLatestResponseId: (latestResponseId: string) =>
        set((draft) => {
          draft.latestResponseId = latestResponseId;
        }),
      isAMessageBeingProcessed: false as const,
      setIsAMessageBeingProcessed: (isAMessageBeingProcessed) =>
        set((draft) => {
          draft.isAMessageBeingProcessed = isAMessageBeingProcessed;
        }),
      demoPlayingStatus: DemoPlayingStatus.INITIAL,
      setDemoPlayingStatus: (demoPlayingStatus) =>
        set((draft) => {
          draft.demoPlayingStatus = demoPlayingStatus;
        }),
      isMediaTakingFullWidth: false,
      setMediaTakeFullScreenWidth: (value) =>
        set((draft) => {
          draft.isMediaTakingFullWidth = typeof value === 'function' ? value(draft.isMediaTakingFullWidth) : value;
        }),
      handleToggleFullScreen: () =>
        set((draft) => {
          draft.isMediaTakingFullWidth = !draft.isMediaTakingFullWidth;
        }),
      hasFirstUserMessageBeenSent: false,
      setHasFirstUserMessageBeenSent: (value) =>
        set((draft) => {
          draft.hasFirstUserMessageBeenSent = value;
        }),
      orbState: OrbStatusEnum.idle,
      handleUpdateOrbState: (selectedOrbState) =>
        set((draft) => {
          draft.orbState = selectedOrbState;
        }),
    })),
  ),
);
