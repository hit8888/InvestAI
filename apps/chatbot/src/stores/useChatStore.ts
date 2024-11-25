import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  hasFirstUserMessageBeenSent: boolean;
  setHasFirstUserMessageBeenSent: (value: boolean) => void;
}

export const useChatStore = create<State>()(
  devtools(
    immer((set) => ({
      hasFirstUserMessageBeenSent: false,
      setHasFirstUserMessageBeenSent: (value) =>
        set((draft) => {
          draft.hasFirstUserMessageBeenSent = value;
        }),
    })),
  ),
);
