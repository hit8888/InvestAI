import FirstMessageArtifactIcon from '../icons/first-message-artifact-icon';

interface IProps {
  defaultArtifactUrl: string | null;
}

const StaticArtifactContainer = ({ defaultArtifactUrl }: IProps) => {
  const isDefaultArtifactUrlExists = !!defaultArtifactUrl;

  return (
    <div className="w-[66%] pl-2 pr-4 pt-4">
      <div className="flex h-full max-h-full w-full items-center justify-center rounded-[10px] border border-gray-200 bg-transparent_gray_3 p-2">
        <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg">
          {isDefaultArtifactUrlExists ? (
            <img src={defaultArtifactUrl} alt="default artifact" className="h-full w-full object-contain" />
          ) : (
            <NudgeArtifactContent />
          )}
        </div>
      </div>
    </div>
  );
};

const NudgeArtifactContent = () => {
  return (
    <div className="shimmer-diagonal relative flex h-full w-full items-center justify-center">
      <FirstMessageArtifactIcon className="z-10 h-24 w-24 animate-pulse-medium text-gray-300" />
    </div>
  );
};

export default StaticArtifactContainer;
