import { ArtifactEnum } from '@meaku/core/types/chat';
import { ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';
import useArtifactData from '../../../hooks/query/useArtifactData';
// import useWebSocketChat from "../../../hooks/useWebSocketChat";
import ArtifactManager from '../../../managers/ArtifactManager';
import { useArtifactStore } from '../../../stores/useArtifactStore';
// import { useChatStore } from "../../../stores/useChatStore";

interface IProps {
  artifactId: string;
  artifactType: string;
}

const truncateText = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  const truncated = text.slice(0, limit);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  return lastSpaceIndex > -1 ? truncated.slice(0, lastSpaceIndex) + '...' : truncated + '...';
};

const ArtifactPreview = ({ artifactId, artifactType }: IProps) => {
  //   const { sendMessage } = useWebSocketChat();
  //   const session = useChatStore((state) => state.session);

  const setActiveArtifactId = useArtifactStore((state) => state.setActiveArtifactId);
  const setActiveArtifactType = useArtifactStore((state) => state.setActiveArtifactType);

  const { data, isError } = useArtifactData({
    artifactId: artifactId as string,
    artifactType: 'SUGGESTIONS',
    options: {
      enabled: !!artifactId && artifactType !== 'NONE',
    },
  });

  const manager = useMemo(() => {
    if (!data) return null;

    return new ArtifactManager(data);
  }, [data]);

  //   const sessionId = session?.session_id;

  const title = manager?.getArtifactTitle();
  const description = manager?.getArtifactDescription();

  const handleArtifactOnClick = () => {
    // TODO: Add Type
    // const payload = {
    //   session_id: sessionId,
    //   event_type: "ARTIFACT_CLICKED",
    //   artifact_id: artifactId,
    // };

    // sendMessage(JSON.stringify(payload));

    setActiveArtifactId(artifactId);
    setActiveArtifactType(artifactType as ArtifactEnum);
  };

  if (isError) return null;

  return (
    <button onClick={handleArtifactOnClick} className="my-3 flex w-11/12 gap-6 rounded-xl bg-primary/10 p-5">
      <div className="h-20 w-32 min-w-32 rounded-lg bg-white"></div>
      <div className="flex flex-1 items-center gap-4">
        <div className="flex flex-col items-start space-y-1 text-left">
          {title ? (
            <h4 className="text-base font-semibold text-primary lg:text-lg 2xl:text-xl">
              Java Developer Test Walkthrough
            </h4>
          ) : (
            <div className="h-4 w-full animate-pulse rounded-lg bg-primary/30" />
          )}
          {description ? (
            <p className="text-sm text-primary/60 2xl:text-base">
              {truncateText(
                `Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        Commodi, rem. Repudiandae quasi saepe nam quos iusto impedit,
        animi accusantium, nesciunt laborum perspiciatis, autem quod a.`,
                150,
              )}
            </p>
          ) : (
            <div className="h-4 w-full animate-pulse rounded-lg" />
          )}
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          <ArrowUpRight className="h-6 w-6 text-primary/80" />
        </div>
      </div>
    </button>
  );
};

export default ArtifactPreview;
