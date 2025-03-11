import { create } from 'zustand';

interface JoinConversationState {
  hasJoinedConversation: boolean;
  setHasJoinedConversation: (joined: boolean) => void;
  adminDisplayName: string;
  setAdminDisplayName: (displayName: string) => void;
}

const useJoinConversationStore = create<JoinConversationState>((set) => ({
  hasJoinedConversation: false,
  setHasJoinedConversation: (joined) => set({ hasJoinedConversation: joined }),
  adminDisplayName: '',
  setAdminDisplayName: (displayName) => set({ adminDisplayName: displayName }),
}));

export default useJoinConversationStore;
