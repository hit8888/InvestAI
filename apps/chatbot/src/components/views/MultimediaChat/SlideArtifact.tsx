import { SlideArtifactType } from "@meaku/core/types/chat";

interface IProps {
  artifact: SlideArtifactType;
}

const SlideArtifact = (props: IProps) => {
  const { artifact } = props;

  return <div className="ui-h-full ui-w-full ui-bg-indigo-400"></div>;
};

export default SlideArtifact;
