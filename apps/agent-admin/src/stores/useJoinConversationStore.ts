import { create } from 'zustand';
import { ActiveConversation } from '../context/ActiveConversationsContext';

export enum JoinConversationStatus {
  PENDING = 'PENDING',
  JOINED = 'JOINED',
  DENIED = 'DENIED',
  EXIT = 'EXIT',
}

interface JoinConversationState {
  currentConversation: ActiveConversation | null;
  setCurrentConversation: (conversation: ActiveConversation | null) => void;
  adminDisplayName: string;
  setAdminDisplayName: (displayName: string) => void;
  adminJobTitle: string;
  setAdminJobTitle: (displayName: string) => void;
  sessionsStatus: Record<string, JoinConversationStatus>;
  updateSessionStatus: (session: string, status: JoinConversationStatus) => void;
}

const useJoinConversationStore = create<JoinConversationState>((set) => ({
  currentConversation: null,
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  adminDisplayName: '',
  setAdminDisplayName: (displayName) => set({ adminDisplayName: displayName }),
  adminJobTitle: '',
  setAdminJobTitle: (jobTitle) => set({ adminJobTitle: jobTitle }),
  sessionsStatus: {},
  updateSessionStatus: (sessionId: string, status: JoinConversationStatus) => {
    set((state) => {
      if (!state.sessionsStatus[sessionId]) {
        return {
          sessionsStatus: {
            ...state.sessionsStatus,
            [sessionId]: status,
          },
        };
      }

      return { sessionsStatus: state.sessionsStatus };
    });
  },
}));

export default useJoinConversationStore;
