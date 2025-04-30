import { create } from 'zustand';

interface JoinConversationState {
  hasJoinedConversation: boolean;
  setHasJoinedConversation: (joined: boolean) => void;
}

const useJoinConversationStore = create<JoinConversationState>((set) => ({
  hasJoinedConversation: false,
  setHasJoinedConversation: (joined) => set({ hasJoinedConversation: joined }),
}));

export default useJoinConversationStore;
