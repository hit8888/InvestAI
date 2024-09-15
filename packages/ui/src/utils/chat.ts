import { ChatConfig } from "@meaku/core/types/config";

export const getChatHeaderText = (config: ChatConfig, orgName: string) => {
  if (config === ChatConfig.EMBED)
    return `You’re now talking to Sam, our Smart Agent at ${orgName}.`;

  return `Need help navigating ${orgName}? Our AI assistant is here to answer your questions.`;
};
