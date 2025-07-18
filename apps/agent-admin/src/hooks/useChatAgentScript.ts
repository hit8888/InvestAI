import { useEffect } from 'react';

const useChatAgentScript = (tenantName: string, userEmail: string, agentId: number | null) => {
  const isStaging = import.meta.env.VITE_APP_ENV !== 'production';

  useEffect(() => {
    if (agentId) {
      const script = document.createElement('script');
      // TODO: Move script src to env variable
      script.src = 'https://script.getbreakout.ai/chat_widget.js';
      script.setAttribute('agent-id', agentId.toString());
      script.setAttribute('tenant-id', tenantName);
      script.setAttribute('container-id', 'embedded-breakout-agent');
      script.setAttribute('is-collapsible', 'false');
      script.setAttribute('hide-bottom-bar', 'true');
      script.setAttribute('feedback-enabled', 'true');
      script.setAttribute('user-email', userEmail);
      script.setAttribute('is-staging', isStaging ? 'true' : 'false');
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isStaging, tenantName, userEmail, agentId]);
};

export default useChatAgentScript;
