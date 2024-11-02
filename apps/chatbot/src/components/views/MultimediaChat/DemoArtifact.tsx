import { DemoArtifactType } from "@meaku/core/types/chat";

interface IProps {
  artifact: DemoArtifactType;
}

const DemoArtifact = (props: IProps) => {
  const { artifact } = props;
  console.log(
    "🚀 ~ file: DemoArtifact.tsx:9 ~ DemoArtifact ~ artifact:",
    artifact,
  );

  return <div>DemoArtifact</div>;
};

export default DemoArtifact;
