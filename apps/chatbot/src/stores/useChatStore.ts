import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  isChatMaximized: boolean;
  setIsChatMaximized: (value: boolean | ((prevState: boolean) => boolean)) => void;
  hasFirstUserMessageBeenSent: boolean;
  setHasFirstUserMessageBeenSent: (value: boolean) => void;
  handleToggleMaximizeChat: () => void;
}

export const useChatStore = create<State>()(
  devtools(
    immer((set) => ({
      isChatMaximized: false,
      setIsChatMaximized: (value) =>
        set((draft) => {
          draft.isChatMaximized = typeof value === 'function' ? value(draft.isChatMaximized) : value;
        }),
      hasFirstUserMessageBeenSent: false,
      setHasFirstUserMessageBeenSent: (value) =>
        set((draft) => {
          draft.hasFirstUserMessageBeenSent = value;
        }),
      handleToggleMaximizeChat: () =>
        set((draft) => {
          draft.isChatMaximized = !draft.isChatMaximized;
        }),
    })),
  ),
);
