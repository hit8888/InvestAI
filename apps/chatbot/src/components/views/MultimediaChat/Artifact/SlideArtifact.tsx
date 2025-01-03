import { SlideArtifactContent } from '@meaku/core/types/chat';
import SlideHeader from '../SlideHeader.tsx';
import SlideItems from '../SlideItems.tsx';
import SlideSubTitle from '../SlideSubTitle.tsx';
import { cn } from '@breakout/design-system/lib/cn';
import useUnifiedConfigurationResponseManager from '../../../../pages/shared/hooks/useUnifiedConfigurationResponseManager.ts';

interface IProps {
  artifact: SlideArtifactContent;
}

const SlideArtifact = ({ artifact: { title, items, sub_title } }: IProps) => {
  const logoUrl = useUnifiedConfigurationResponseManager().getLogoUrl();

  return (
    <svg
      className="h-auto w-full"
      viewBox="0 0 1600 900" // Define the scaling area
      preserveAspectRatio="xMidYMid meet" // Ensures proportional scaling
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject x="0" y="0" width="100%" height="100%">
        <div className="relative flex h-full w-full flex-col bg-gray-25 p-7">
          <SlideHeader title={title} logoUrl={logoUrl} />

          <div className="grid h-full grid-cols-6 px-8 ">
            {sub_title && <SlideSubTitle text={sub_title} />}
            <div className={cn('col-span-6 h-full', { 'col-span-3': sub_title })}>
              <SlideItems items={items} />
            </div>
          </div>

          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-secondary opacity-40 blur-3xl"></div>
          <div className="absolute -bottom-44 left-32 h-80 w-80 rounded-full bg-primary opacity-15 blur-3xl"></div>
        </div>
      </foreignObject>
    </svg>
  );
};

export default SlideArtifact;
