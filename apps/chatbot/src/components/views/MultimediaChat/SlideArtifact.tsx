import { SlideArtifactType } from "@meaku/core/types/chat";

interface IProps {
  artifact: SlideArtifactType;
}

const SlideArtifact = (props: IProps) => {
  const { artifact } = props;

  return <div className="h-full w-full bg-indigo-400"></div>;
};

export default SlideArtifact;
