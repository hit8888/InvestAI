import { DemoArtifactType } from "@meaku/core/types/chat";

interface IProps {
  artifact: DemoArtifactType;
}

const DemoArtifact = (props: IProps) => {
  const { artifact } = props;

  return <div>DemoArtifact</div>;
};

export default DemoArtifact;
