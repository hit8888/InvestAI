import SlideHeader from '../layout/SlideHeader';
import SlideSubTitle from '../layout/SlideSubTitle';
import SlideItems from '../layout/SlideItems';
import { SlideArtifactContent } from '@meaku/core/types/artifact';
import { useSlideArtifactScaleSystem } from '../../hooks/useSlideArtifactScaleSystem';

interface IProps {
  artifact: SlideArtifactContent;
  logoURL: string;
  onItemClick: (title: string) => void;
}

const SlideArtifact = ({ artifact: { title, items, sub_title }, logoURL, onItemClick }: IProps) => {
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  return (
    <div ref={containerRef} className="relative aspect-video w-full">
      <div className="absolute inset-0 overflow-hidden bg-gray-25">
        <div className="absolute -bottom-24 -left-24 h-40 w-40 rounded-full bg-secondary opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-24 left-24 h-40 w-40 rounded-full bg-primary opacity-25 blur-3xl"></div>
        <div
          className="relative h-full w-full origin-top-left p-2"
          style={{
            transform: `scale(${scale})`,
            minHeight: '900px',
            minWidth: '1600px',
          }}
        >
          <div className="relative flex h-full w-full flex-col p-5">
            <SlideHeader title={title} logoUrl={logoURL} />
            <div className="flex h-full w-full ">
              {sub_title && <SlideSubTitle text={sub_title} />}
              <div className="h-full w-2/3">
                <SlideItems items={items} onItemClick={onItemClick} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideArtifact;
