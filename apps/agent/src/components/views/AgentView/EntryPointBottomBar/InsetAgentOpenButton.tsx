import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

interface IProps {
  handleOpenAgent: () => void;
  openInsetAgentButton: boolean;
}

const InsetAgentOpenButton = ({ handleOpenAgent, openInsetAgentButton }: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const handleClickOpenAgent = () => {
    trackAgentbotEvent(ANALYTICS_EVENT_NAMES.ENTRY_CLICKED_SUBSEQUENT_TIME, { isAgentOpen: false });
    handleOpenAgent();
  };
  if (!openInsetAgentButton) return null;

  return <button className="absolute inset-0 z-50 rounded-xl" onClick={handleClickOpenAgent}></button>;
};

export default InsetAgentOpenButton;
