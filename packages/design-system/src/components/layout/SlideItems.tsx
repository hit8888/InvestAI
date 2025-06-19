import { cn } from '@breakout/design-system/lib/cn';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { useDynamicHeight } from '../../hooks/useDynamicHeight';
import SlideItem from './SlideItem';
import { SlideArtifactContent } from '@meaku/core/types/artifact';

interface IProps {
  items: SlideArtifactContent['items'];
  onItemClick: (title: string) => void;
}

const getLayoutClass = (totalItems: number) => {
  return cn(
    // Base classes that apply to all cases
    'flex flex-wrap items-center justify-center p-4',

    // Conditional classes based on total items
    {
      'w-2/3 flex-col gap-10 max-w-4xl': totalItems <= 2,
      'gap-6 max-w-5xl': totalItems > 2 && totalItems <= 4,
      'gap-6 max-w-6xl': totalItems > 4 && totalItems <= 6,
      'gap-4 max-w-7xl': totalItems > 6, // for 7-10 items
    },
  );
};

const getItemClass = (totalItems: number) => {
  // Base width for items depending on total count
  if (totalItems <= 2) return 'w-[calc(100%-1rem)] flex-1';
  if (totalItems <= 4) return 'w-[calc(50.333%-1rem)]';
  if (totalItems === 5) return 'w-[calc(50.333%-1rem)]';
  if (totalItems <= 7) return 'w-[calc(33.333%-1rem)]';
  if (totalItems <= 9) return 'w-[calc(33.333%-1rem)]';
  return 'w-[20%]'; //  > 10 items
};

const SlideItems = ({ items, onItemClick }: IProps) => {
  const itemsLength = items.length;
  const { maxHeight, setItemRef } = useDynamicHeight({
    dependencies: [items],
  });

  // Explicitly handle SlideItem layout for 5 items as per figma design
  // Link:- https://www.figma.com/design/LTtSceISNhOxccfdii2RaC/Breakout---%F0%9F%94%B5-Hackerearth-%F0%9F%94%B5?node-id=6465-53635&t=YwyFtnY1n5T5oep4-0
  if (itemsLength === 5) {
    return (
      <div className="flex h-full items-center justify-center overflow-auto" data-testid="slide-container">
        <div className="flex w-full max-w-7xl gap-8 px-4">
          {/* Left Column */}
          <div className="flex w-1/2 flex-col gap-4">
            {items.slice(0, 2).map((item, idx) => (
              <div
                ref={setItemRef(idx)}
                key={item.title}
                className={cn(
                  'w-full',
                  // Adjust vertical position of first two items
                  idx === 0 ? 'translate-y-[50%]' : 'translate-y-[70%]',
                )}
                style={maxHeight > 0 ? { height: maxHeight } : undefined}
              >
                <SlideItem
                  title={item.title}
                  icon={item.icon as keyof typeof dynamicIconImports}
                  onClick={onItemClick}
                  addLineClamp={false}
                />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="flex w-1/2 flex-col gap-4">
            {items.slice(2).map((item, idx) => (
              <div
                ref={setItemRef(idx + 2)}
                key={item.title}
                className={cn(
                  'w-full',
                  // Adjust vertical position of right column items
                  idx === 0 ? '-translate-y-[10%]' : '',
                  idx === 1 ? 'translate-y-0' : '',
                  idx === 2 ? 'translate-y-[10%]' : '',
                )}
                style={maxHeight > 0 ? { height: maxHeight } : undefined}
              >
                <SlideItem
                  title={item.title}
                  icon={item.icon as keyof typeof dynamicIconImports}
                  onClick={onItemClick}
                  addLineClamp={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto" data-testid="slide-container">
      <div className={getLayoutClass(itemsLength)}>
        {items.map((item, index) => (
          <div
            ref={setItemRef(index)}
            className={cn(
              getItemClass(itemsLength),
              'min-w-[200px]', // Minimum width to prevent squishing
              'transition-all duration-300',
            )}
            key={item.title}
            style={maxHeight > 0 ? { height: maxHeight } : undefined}
          >
            <SlideItem
              title={item.title}
              icon={item.icon as keyof typeof dynamicIconImports}
              onClick={onItemClick}
              addLineClamp={itemsLength > 5}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideItems;
