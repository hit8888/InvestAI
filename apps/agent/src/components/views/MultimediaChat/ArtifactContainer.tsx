import Artifact from '@breakout/design-system/components/Artifact/index';
import { useArtifactStore } from '../../../stores/useArtifactStore';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import { useMessageStore } from '../../../stores/useMessageStore';

type IProps = {
  logoURL: string;
  showArtifactContent: boolean;
  isMediaTakingFullWidth: boolean;
  handleSendMessage: (data: IWebSocketHandleMessage) => void;
};

const ArtifactContainer = ({ logoURL, showArtifactContent, isMediaTakingFullWidth, handleSendMessage }: IProps) => {
  const handleToggleFullScreen = useMessageStore((state) => state.handleToggleFullScreen);

  const setIsArtifactPlaying = useArtifactStore((state) => state.setIsArtifactPlaying);
  const activeArtifact = useArtifactStore((state) => state.activeArtifact);
  const previousArtifact = useArtifactStore((state) => state.previousArtifact);
  const setActiveArtifact = useArtifactStore((state) => state.setActiveArtifact);
  const setPreviousActiveArtifact = useArtifactStore((state) => state.setPreviousActiveArtifact);

  if (!showArtifactContent) return null;

  return (
    <Artifact
      logoURL={logoURL}
      isMediaTakingFullWidth={isMediaTakingFullWidth}
      handleSendUserMessage={handleSendMessage}
      handleToggleFullScreen={handleToggleFullScreen}
      setIsArtifactPlaying={setIsArtifactPlaying}
      activeArtifact={activeArtifact}
      previousArtifact={previousArtifact}
      setActiveArtifact={setActiveArtifact}
      setPreviousActiveArtifact={setPreviousActiveArtifact}
    />
  );
};

export default ArtifactContainer;
