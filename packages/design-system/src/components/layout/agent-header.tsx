import { MessageCircleIcon } from 'lucide-react';
import { memo, useMemo } from 'react';
import Button from './button';

type Props = {
  orgName: string;
  agentName: string;
  subtitle: string;
  handlePrimaryCta?: () => void;
};

const AgentHeader = ({ agentName, orgName, subtitle, handlePrimaryCta }: Props) => {
  const showCtaInEmbedMode = typeof handlePrimaryCta === 'function';

  const headerText = useMemo(() => {
    if (subtitle) return subtitle;

    return `You’re now talking to ${agentName}, our Smart Agent at ${orgName}.`;
  }, [orgName, subtitle]);

  return (
    <div className="bg-primary p-4 text-primary-foreground">
      <div className="flex items-center justify-between">
        <h2 className="text-sm">{headerText}</h2>

        {showCtaInEmbedMode && (
          <Button
            onClick={handlePrimaryCta}
            className="flex items-center gap-2 rounded-md bg-primary-foreground/70 !text-primary"
          >
            <MessageCircleIcon className="h-5 w-5" />
            <p className="text-sm">Book a demo</p>
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(AgentHeader);
