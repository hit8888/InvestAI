import SlideHeader from '../layout/SlideHeader';
import SlideSubTitle from '../layout/SlideSubTitle';
import SlideItems from '../layout/SlideItems';
import { SlideArtifactContent } from '@meaku/core/types/artifact';
import { useSlideArtifactScaleSystem } from '../../hooks/useSlideArtifactScaleSystem';
import SlideBackgroundPattern from '../layout/SlideBackgroundPattern';
import ArtifactWhiteBgEllipse from '../icons/artifact-white-bg-ellipse';
import { AspectRatio } from '@breakout/design-system/components/layout/aspect-ratio';

interface IProps {
  artifact: SlideArtifactContent;
  logoURL: string;
  onItemClick: (title: string) => void;
}

const SlideArtifact = ({ artifact: { items, sub_title }, logoURL, onItemClick }: IProps) => {
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  return (
    <AspectRatio ratio={16 / 9}>
      <div ref={containerRef} className="relative aspect-video w-full">
        <div className="absolute inset-0 overflow-hidden rounded-lg border border-gray-200">
          <SlideBackgroundPattern patternColor="rgb(var(--primary) / 0.2)" />
          <ArtifactWhiteBgEllipse />

          <div
            className="relative z-50 h-full w-full origin-top-left p-2"
            style={{
              transform: `scale(${scale})`,
              minHeight: '900px',
              minWidth: '1600px',
            }}
          >
            <div className="relative flex h-full w-full flex-col p-5 pt-8">
              <SlideHeader logoUrl={logoURL} />
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
    </AspectRatio>
  );
};

export default SlideArtifact;
