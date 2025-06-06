import SlideHeader from '../layout/SlideHeader';
import SlideSubTitle from '../layout/SlideSubTitle';
import SlideItems from '../layout/SlideItems';
import { SlideArtifactContent } from '@meaku/core/types/artifact';
import CommonSlideArtifactContent from './CommonSlideArtifactContent';

interface IProps {
  artifact: SlideArtifactContent;
  logoURL: string;
  onItemClick: (title: string) => void;
}

const SlideArtifact = ({ artifact: { items, sub_title, title }, logoURL, onItemClick }: IProps) => {
  return (
    <CommonSlideArtifactContent>
      <div className="relative flex h-full w-full flex-col p-5 pt-8">
        <SlideHeader logoUrl={logoURL} />
        <div className="flex h-full w-full items-center justify-center ">
          {(sub_title || title) && <SlideSubTitle text={sub_title || title} />}
          <div className="h-full w-2/3">
            <SlideItems items={items} onItemClick={onItemClick} />
          </div>
        </div>
      </div>
    </CommonSlideArtifactContent>
  );
};

export default SlideArtifact;
