import { ArrowUpRight, Image } from 'lucide-react';
import { cn } from '@breakout/design-system/lib/cn';

interface IProps {
  handleArtifactOnClick: () => void;
  isFetching: boolean;
  title?: string;
}

const SlideArtifactPreview = (props: IProps) => {
  const { handleArtifactOnClick, isFetching, title } = props;

  return (
    <button
      onClick={handleArtifactOnClick}
      className="mt-3 w-full flex-col gap-1 rounded-xl border border-primary/20 bg-primary-foreground p-2 transition-colors duration-300 ease-in-out hover:bg-primary/20"
    >
      <div className="flex items-center justify-between">
        <div className="mr-2 flex h-12 min-h-12 w-12 min-w-12 items-center justify-center rounded-xl bg-primary/10">
          <Image className="text-primary/70" height={22} width={22} />
        </div>
        {isFetching ? (
          <div className="h-4 w-full animate-pulse rounded-lg bg-primary/40" />
        ) : (
          <div
            className={cn('flex flex-1 flex-col items-start text-left', {
              'space-y-1': title,
              'space-y-6': !title,
            })}
          >
            {title && <h4 className="2xl:text-md text-base font-medium text-primary/80 lg:text-sm">{title}</h4>}
          </div>
        )}
        <div className="ml-2 flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-full bg-primary/10">
          <ArrowUpRight className="text-primary/70" height={16} width={16} />
        </div>
      </div>
    </button>
  );
};

export default SlideArtifactPreview;
