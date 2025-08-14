import type { Message } from './message';

export interface InitSessionResponse {
  agent_id: string;
  chat_history: Message[];
  feedback: string[];
  prospect_id: string;
  session_id: string;
}
