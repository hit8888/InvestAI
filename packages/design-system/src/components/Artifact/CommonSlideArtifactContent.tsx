import { useSlideArtifactScaleSystem } from '../../hooks/useSlideArtifactScaleSystem';
import SlideBackgroundPattern from '../layout/SlideBackgroundPattern';
import ArtifactWhiteBgEllipse from '../icons/artifact-white-bg-ellipse';
import { AspectRatio } from '../layout/aspect-ratio';

type CommonSlideArtifactContentProps = {
  children: React.ReactNode;
};

const CommonSlideArtifactContent = ({ children }: CommonSlideArtifactContentProps) => {
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  return (
    <AspectRatio ratio={16 / 9}>
      <div ref={containerRef} className="relative aspect-video h-full w-full">
        <div className="absolute h-full w-full overflow-hidden rounded-lg border border-gray-200">
          <SlideBackgroundPattern patternColor="rgb(var(--primary) / 0.2)" />
          <ArtifactWhiteBgEllipse />

          <div
            className="relative z-10 h-full w-full origin-top-left p-2"
            style={{
              transform: `scale(${scale})`,
              minHeight: '900px',
              minWidth: '1600px',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </AspectRatio>
  );
};

export default CommonSlideArtifactContent;
