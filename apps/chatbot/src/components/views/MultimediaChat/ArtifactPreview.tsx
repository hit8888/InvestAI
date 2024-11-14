import { cn } from "@breakout/design-system/lib/cn";
import { ArtifactEnum } from "@meaku/core/types/chat";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import useArtifactData from "../../../hooks/query/useArtifactData";
import ArtifactManager from "../../../managers/ArtifactManager";
import { useArtifactStore } from "../../../stores/useArtifactStore";

interface IProps {
  artifactId: string;
  artifactType: string;
}

const truncateText = (text: string, limit: number): string => {
  if (text.length <= limit) return text;
  const truncated = text.slice(0, limit);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  return lastSpaceIndex > -1
    ? truncated.slice(0, lastSpaceIndex) + "..."
    : truncated + "...";
};

const ArtifactPreview = ({ artifactId, artifactType }: IProps) => {
  // const activeArtifactId = useArtifactStore((state) => state.activeArtifactId);
  const setActiveArtifactId = useArtifactStore(
    (state) => state.setActiveArtifactId,
  );
  const setActiveArtifactType = useArtifactStore(
    (state) => state.setActiveArtifactType,
  );

  const { data, isError } = useArtifactData({
    artifactId: artifactId as string,
    artifactType: artifactType as ArtifactEnum,
    options: {
      enabled: !!artifactId && artifactType !== "NONE",
    },
  });

  const manager = useMemo(() => {
    if (!data) return null;

    return new ArtifactManager(data);
  }, [data]);

  const title = manager?.getArtifactTitle();
  const description = manager?.getArtifactDescription();

  const handleArtifactOnClick = () => {
    setActiveArtifactId(artifactId);
    setActiveArtifactType(artifactType as ArtifactEnum);
  };

  if (isError) return null;

  return (
    <button
      onClick={handleArtifactOnClick}
      className="my-3 flex w-11/12 gap-6 rounded-xl bg-primary/10 p-5 transition-colors duration-300 ease-in-out hover:bg-primary/20"
    >
      <div className="h-20 w-32 min-w-32 rounded-lg bg-white"></div>
      <div className="flex flex-1 items-center gap-4">
        <div
          className={cn("flex flex-1 flex-col items-start text-left", {
            "space-y-1": title && description,
            "space-y-6": !title || !description,
          })}
        >
          {title ? (
            <h4 className="text-base font-semibold text-primary lg:text-lg 2xl:text-xl">
              {title}
            </h4>
          ) : (
            <div className="h-4 w-full animate-pulse rounded-lg bg-primary/30" />
          )}
          {description ? (
            <p className="text-sm text-primary/60 2xl:text-base">
              {truncateText(description, 100)}
            </p>
          ) : (
            <div className="h-4 w-full animate-pulse rounded-lg bg-primary/40" />
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
