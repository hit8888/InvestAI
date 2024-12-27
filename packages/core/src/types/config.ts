export enum ChatConfig {
  EMBED = "embed",
  MULTIMEDIA = "multimedia",
}

export type ChatParams = {
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
