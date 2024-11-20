import { SlideArtifactType } from '@meaku/core/types/chat';
import SlideHeader from './SlideHeader';
import SlideItems from './SlideItems';
import SlideSubTitle from './SlideSubTitle';

interface IProps {
  artifact: SlideArtifactType;
}

const SlideArtifact = (props: IProps) => {
  const {
    artifact: { title, items, sub_title },
  } = props;

  return (
    <div className="relative flex h-full w-full flex-col bg-gray-25 p-6">
      <SlideHeader title={title} />

      <div className="grid h-full flex-1 grid-cols-5 px-8">
        {sub_title && <SlideSubTitle text={sub_title} />}
        <div className="col-span-3 h-full">
          <SlideItems items={items} />
        </div>
      </div>

      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary opacity-40 blur-3xl"></div>
      <div className="absolute -bottom-44 left-32 h-80 w-80 rounded-full bg-primary opacity-15 blur-3xl"></div>
    </div>
  );
};

export default SlideArtifact;
