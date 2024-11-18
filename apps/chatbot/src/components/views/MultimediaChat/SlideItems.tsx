import { cn } from '@breakout/design-system/lib/cn';
import { SlideArtifactType } from '@meaku/core/types/chat';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import SlideItem from './SlideItem';

interface IProps {
  items: SlideArtifactType['items'];
}

//TODO: KK: Move this to design system
const SlideItems = (props: IProps) => {
  const { items } = props;
  const itemsLength = items.length;

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={cn('grid w-full grid-cols-6', {
          'gap-7': itemsLength <= 4,
          'gap-5': itemsLength > 4,
        })}
      >
        {items.map((item, idx) => (
          <div
            className={cn('col-span-3', {
              'col-start-4': idx === 0,
              'col-start-2 row-start-2': idx === 1 && itemsLength <= 3,
              'col-start-1 row-start-1': idx === 2,
              'col-start-4 row-start-3': idx === 3 && itemsLength > 4,
              'translate-y-1/2 transform': (idx === 1 || idx === 2) && itemsLength > 4,
              'translate-x-[18.5%] transform': idx === 1 && itemsLength === 3,
            })}
            key={item.title}
          >
            <SlideItem title={item.title} icon={item.icon as keyof typeof dynamicIconImports} />
          </div>
        ))}
      </div>
      {/* DO NOT REMOVE THIS SPAN, THIS IS THERE SO THAT THE TAILWIND CLASSES ARE PRESENT FOR US TO USE THEM DYNAMICALLY */}
      <span className="hidden grid-cols-2 grid-cols-3 grid-cols-3 grid-cols-4"></span>
    </div>
  );
};

export default SlideItems;
