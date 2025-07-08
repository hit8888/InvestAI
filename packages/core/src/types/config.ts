export type AgentParams = {
  orgName: string;
  agentId: string;
  browsed_urls?: string;
};

export enum OrbStatusEnum {
  idle = 'idle',
  takingInput = 'takingInput',
  thinking = 'thinking',
  responding = 'responding',
  waiting = 'waiting',
}
