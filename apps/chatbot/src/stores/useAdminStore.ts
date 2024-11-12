import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  sessionId: string | null;
  setSessionId: (sessionId: string) => void;
  prospectId: string | null;
  setProspectId: (prospectId: string) => void;
}

export const useAdminStore = create<State>()(
  devtools(
    immer((set) => ({
      sessionId: null,
      setSessionId: (sessionId) => {
        set((state) => {
          state.sessionId = sessionId;
        });
      },
      prospectId: null,
      setProspectId: (prospectId) => {
        set((state) => {
          state.prospectId = prospectId;
        });
      },
    })),
  ),
);
