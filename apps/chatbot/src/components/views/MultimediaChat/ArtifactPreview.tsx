import { cn } from "@breakout/design-system/lib/cn";
import { ArtifactEnum } from "@meaku/core/types/chat";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import useArtifactData from "../../../hooks/query/useArtifactData";
import ArtifactManager from "../../../managers/ArtifactManager";
import { useArtifactStore } from "../../../stores/useArtifactStore";
import CirclePlay from "@breakout/design-system/components/icons/circle-play";

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

  const { data, isFetching, isError } = useArtifactData({
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
  let description: string | null | undefined =
    manager?.getArtifactDescription();

  if (artifactType === "SLIDE" || artifactType === "SLIDE_IMAGE") {
    description = null;
  }

  const handleArtifactOnClick = () => {
    setActiveArtifactId(artifactId);
    setActiveArtifactType(artifactType as ArtifactEnum);
  };

  if (isError) return null;

  return (
    <button
      onClick={handleArtifactOnClick}
      className="mt-3 flex-col gap-6 rounded-xl bg-primary/10 p-5 transition-colors duration-300 ease-in-out hover:bg-primary/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-14 min-h-14 w-14 min-w-14 items-center justify-center rounded-xl border-2 border-primary-foreground/60 bg-primary/70">
          <CirclePlay height={32} width={32} />
        </div>
        <div className="flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-full bg-primary/10">
          <ArrowUpRight className="text-primary/70" height={24} width={24} />
        </div>
      </div>
      <div className=" mt-2 flex items-center gap-4">
        {isFetching ? (
          <div className="h-4 w-full animate-pulse rounded-lg bg-primary/40" />
        ) : (
          <div
            className={cn("flex flex-1 flex-col items-start text-left", {
              "space-y-1": title && description,
              "space-y-6": !title || !description,
            })}
          >
            {title ? (
              <h4 className="lg:text-md text-base font-semibold text-primary 2xl:text-lg">
                {title}
              </h4>
            ) : (
              <div className="h-4 w-full animate-pulse rounded-lg bg-primary/30" />
            )}
            {description && (
              <p className="text-sm text-primary/60 2xl:text-base">
                {truncateText(description, 100)}
              </p>
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default ArtifactPreview;
