import { SlideArtifactType } from '@meaku/core/types/chat';
import SlideItems from './SlideItems';
import SlideSubTitle from './SlideSubTitle';
import SlideTitle from './SlideTitle';

interface IProps {
  artifact: SlideArtifactType;
}

const SlideArtifact = (props: IProps) => {
  const {
    artifact: { title, items, sub_title },
  } = props;

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-25 px-12 py-8">
      <div className="flex flex-col gap-6">
        {title && <SlideTitle text={title} />}
        {sub_title && <SlideSubTitle text={sub_title} />}
      </div>
      {items && <SlideItems items={items} />}
    </div>
  );
};

export default SlideArtifact;
