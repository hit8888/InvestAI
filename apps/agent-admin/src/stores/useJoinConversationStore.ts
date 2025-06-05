import { create } from 'zustand';
import { ActiveConversation } from '../context/ActiveConversationsContext';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';

interface JoinConversationState {
  currentConversation: ActiveConversation | null;
  setCurrentConversation: (conversation: ActiveConversation | null) => void;
  adminDisplayName: string;
  setAdminDisplayName: (displayName: string) => void;
  adminJobTitle: string;
  setAdminJobTitle: (displayName: string) => void;
  sessionsStatus: Record<string, AdminConversationJoinStatus>;
  updateSessionStatus: (session: string, status: AdminConversationJoinStatus) => void;
  isGeneratingAIResponse: boolean;
  setIsGeneratingAIResponse: (isGeneratingAIResponse: boolean) => void;
}

const useJoinConversationStore = create<JoinConversationState>((set) => ({
  currentConversation: null,
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  adminDisplayName: '',
  setAdminDisplayName: (displayName) => set({ adminDisplayName: displayName }),
  adminJobTitle: '',
  setAdminJobTitle: (jobTitle) => set({ adminJobTitle: jobTitle }),
  sessionsStatus: {},
  updateSessionStatus: (sessionId: string, status: AdminConversationJoinStatus) => {
    set((state) => {
      return {
        sessionsStatus: {
          ...state.sessionsStatus,
          [sessionId]: status,
        },
      };
    });
  },
  isGeneratingAIResponse: false,
  setIsGeneratingAIResponse: (isGeneratingAIResponse) => set({ isGeneratingAIResponse }),
}));

export default useJoinConversationStore;
