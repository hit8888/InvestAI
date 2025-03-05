import { useEffect } from 'react';

const useChatAgentScript = (tenantName: string, userEmail: string) => {
  const isStaging = import.meta.env.VITE_APP_ENV !== 'production';
  useEffect(() => {
    const script = document.createElement('script');
    // TODO: Move script src to env variable
    script.src = 'https://script.getbreakout.ai/chat_widget.js';
    // TODO: agent-id should be dynamic
    script.setAttribute('agent-id', '1');
    script.setAttribute('tenant-id', tenantName);
    script.setAttribute('container-id', 'embedded-breakout-agent');
    script.setAttribute('is-collapsible', 'false');
    script.setAttribute('hide-bottom-bar', 'true');
    script.setAttribute('feedback-enabled', 'false');
    script.setAttribute('user-email', userEmail);
    script.setAttribute('is-staging', isStaging ? 'true' : 'false');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isStaging, tenantName, userEmail]);
};

export default useChatAgentScript;
