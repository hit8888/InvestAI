import { ConfigurationApiResponse, SessionApiResponse } from '@meaku/core/types/session';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { ChatBoxArtifactType } from '@meaku/core/types/chat';

interface State {
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
  isChatMaximized: boolean;
  setIsChatMaximized: (value: boolean | ((prevState: boolean) => boolean)) => void;
  showTooltip: boolean;
  setShowTooltip: (value: boolean) => void;
  orgName: string | null;
  setOrgName: (orgName: string) => void;
  agentId: string | null;
  setAgentId: (agentId: string) => void;
  session: SessionApiResponse | null;
  setSession: (session: SessionApiResponse) => void;
  configuration: ConfigurationApiResponse | null;
  setConfiguration: (configuration: ConfigurationApiResponse) => void;
  hasFirstUserMessageBeenSent: boolean;
  setHasFirstUserMessageBeenSent: (value: boolean) => void;
  handleToggleMaximizeChat: () => void;
  suggestionArtifactId: string | null;
  setSuggestionArtifactId: (suggestionArtifactId: string | null) => void;
  activeChatArtifactId: string | null;
  activeChatArtifactType: ChatBoxArtifactType | null;
  handleAddActiveChatArtifact: (artifactId: string | null, artifactType: ChatBoxArtifactType) => void;
  handleRemoveActiveChatArtifact: () => void;
}

export const useChatStore = create<State>()(
  devtools(
    immer((set) => ({
      isChatOpen: false,
      setIsChatOpen: (value) =>
        set((draft) => {
          draft.isChatOpen = typeof value === 'function' ? value(draft.isChatOpen) : value;
        }),
      isChatMaximized: false,
      setIsChatMaximized: (value) =>
        set((draft) => {
          draft.isChatMaximized = typeof value === 'function' ? value(draft.isChatMaximized) : value;
        }),
      showTooltip: false,
      setShowTooltip: (value) =>
        set((draft) => {
          draft.showTooltip = value;
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
      handleToggleMaximizeChat: () =>
        set((draft) => {
          draft.isChatMaximized = !draft.isChatMaximized;
        }),
      suggestionArtifactId: null,
      setSuggestionArtifactId: (suggestionArtifactId) =>
        set((draft) => {
          draft.suggestionArtifactId = suggestionArtifactId;
        }),
      activeChatArtifactId: null,
      activeChatArtifactType: null,
      handleAddActiveChatArtifact: (artifactId, artifactType) => {
        set((state) => {
          state.activeChatArtifactId = artifactId;
          state.activeChatArtifactType = artifactType;
        });
      },
      handleRemoveActiveChatArtifact: () => {
        set((state) => {
          state.activeChatArtifactId = null;
          state.activeChatArtifactType = null;
        });
      },
    })),
  ),
);
