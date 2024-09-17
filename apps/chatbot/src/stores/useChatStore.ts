import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
  orgName: string | null;
  setOrgName: (orgName: string) => void;
  agentId: string | null;
  setAgentId: (agentId: string) => void;
}

export const useChatStore = create<State>()(
  devtools(
    immer((set) => ({
      isChatOpen: false,
      setIsChatOpen: (value) =>
        set((draft) => {
          draft.isChatOpen =
            typeof value === "function" ? value(draft.isChatOpen) : value;
        }),
      orgName: null,
      setOrgName: (orgName) =>
        set((draft) => {
          draft.orgName = orgName;
        }),
      agentId: null,
      setAgentId: (agentId) =>
        set((draft) => {
          draft.agentId = agentId;
        }),
    })),
  ),
);
