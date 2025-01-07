export enum AgentConfig {
  EMBED = "embed",
  MULTIMEDIA = "multimedia",
}

export type AgentParams = {
  orgName: string;
  agentId: string;
};

export enum OrbStatusEnum {
  idle = "idle",
  takingInput = "takingInput",
  thinking = "thinking",
  responding = "responding",
  waiting = "waiting",
}
