import PopupWithBubblesContainer from '../EntryPopupBanner/PopupWithBubblesContainer';
import useConfigurationApiResponseManager from '@meaku/core/hooks/useConfigurationApiResponseManager';
import { EntryPointAlignmentType } from '@meaku/core/types/entryPoint';
import { useMessageStore } from '../../../../stores/useMessageStore';

interface IProps {
  showBubbles: boolean;
  setShowBubbles: (value: boolean) => void;
  setShowOrbAfterBubblesDisappear: (value: boolean) => void;
  entryPointAlignment: EntryPointAlignmentType;
}

const PopupBannerContent = ({
  showBubbles,
  setShowBubbles,
  setShowOrbAfterBubblesDisappear,
  entryPointAlignment,
}: IProps) => {
  const configurationApiResponseManager = useConfigurationApiResponseManager();
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);

  const { banner_config } = configurationApiResponseManager.getStyleConfig();
  const orgName = configurationApiResponseManager.getOrgName();
  const agentName = configurationApiResponseManager.getAgentName();

  const showBanner = banner_config?.show_banner && !hasFirstUserMessageBeenSent;

  if (!showBanner) return null;

  return (
    <PopupWithBubblesContainer
      orgName={orgName}
      agentName={agentName}
      showBubbles={showBubbles}
      popupBannerAlignment={entryPointAlignment}
      setShowBubbles={setShowBubbles}
      setShowOrbAfterBubblesDisappear={setShowOrbAfterBubblesDisappear}
      header={banner_config?.header}
      subheader={banner_config?.subheader}
    />
  );
};

export default PopupBannerContent;
