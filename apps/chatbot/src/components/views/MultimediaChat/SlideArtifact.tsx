import { SlideArtifactType } from "@meaku/core/types/chat";
import SlideItems from "./SlideItems";
import SlideTitle from "./SlideTitle";

interface IProps {
  artifact: SlideArtifactType;
}

const SlideArtifact = (props: IProps) => {
  const {
    artifact: { title, items, sub_title },
  } = props;

  return (
    <div className="h-full w-full">
      {title && <SlideTitle text={title} />}
      {sub_title && <SlideTitle text={sub_title} />}
      {items && <SlideItems items={items} />}
    </div>
  );
};

export default SlideArtifact;
