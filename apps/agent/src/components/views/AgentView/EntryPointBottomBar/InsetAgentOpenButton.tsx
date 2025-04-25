import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { useMessageStore } from '../../../../stores/useMessageStore';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  handleOpenAgent: () => void;
}

const InsetAgentOpenButton = ({ handleOpenAgent }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const handleClickOpenAgent = () => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.ENTRY_CLICKED_SUBSEQUENT_TIME, { isAgentOpen: false });
    handleOpenAgent();
  };
  if (!hasFirstUserMessageBeenSent) return null;

  return <button className="absolute inset-0 z-50 rounded-xl" onClick={handleClickOpenAgent}></button>;
};

export default InsetAgentOpenButton;
