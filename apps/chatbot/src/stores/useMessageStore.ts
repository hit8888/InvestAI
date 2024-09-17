import { ChatConfig } from "@meaku/core/types/config";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  config: ChatConfig | null;
  setConfig: (config: ChatConfig) => void;
}

export const useMessageStore = create<State>()(
  devtools(
    immer((set) => ({
      config: null,
      setConfig: (config) => set((state) => (state.config = config)),
    })),
  ),
);
