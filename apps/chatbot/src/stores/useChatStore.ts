import { Configuration, Session } from "@meaku/core/types/session";
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
  session: Session | null;
  setSession: (session: Session) => void;
  configuration: Configuration | null;
  setConfiguration: (configuration: Configuration) => void;
  hasFirstUserMessageBeenSent: boolean;
  setHasFirstUserMessageBeenSent: (value: boolean) => void;
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
      session: null,
      setSession: (session) =>
        set((draft) => {
          draft.session = session;
        }),
      configuration: null,
      setConfiguration: (configuration) =>
        set((draft) => {
          draft.configuration = configuration;
        }),
      hasFirstUserMessageBeenSent: false,
      setHasFirstUserMessageBeenSent: (value) =>
        set((draft) => {
          draft.hasFirstUserMessageBeenSent = value;
        }),
    })),
  ),
);
