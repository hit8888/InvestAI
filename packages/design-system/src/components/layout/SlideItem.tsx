import dynamicIconImports from 'lucide-react/dynamicIconImports';
import DynamicIcon from '../icons/DynamicIcon';
import { cn } from '../../lib/cn';

interface IProps {
  icon: keyof typeof dynamicIconImports;
  title: string;
  onClick: (title: string) => void;
  addLineClamp?: boolean;
}

const SlideItem = ({ icon, title, onClick, addLineClamp }: IProps) => {
  const handleClick = () => {
    onClick(title);
  };

  return (
    <div className="group/item hover:popup-banner-border-gradient-animation w-full rounded-[25px] bg-gray-200 p-0.5 transition-all duration-700 hover:scale-105 hover:p-0.5">
      <button
        type="button"
        className="slideitem-default-boxshadow hover:slideitem-hover-boxshadow active:ring-6 flex h-full w-full cursor-pointer flex-col items-center gap-8 rounded-3xl 
        bg-white p-4  text-center focus:outline-none focus:ring-4 focus:ring-primary/50 
    focus:ring-offset-2 active:ring-primary/50 active:ring-offset-2"
        onClick={handleClick}
      >
        <div className="flex h-20 w-full items-center justify-center rounded-xl border border-primary/10 bg-primary/2.5 group-hover/item:border-primary/40 group-hover/item:bg-primary/10">
          <DynamicIcon icon={icon} className="h-12 w-12 text-customPrimaryText group-hover/item:text-primary" />
        </div>
        <h4
          className={cn(
            'w-full text-center text-lg font-semibold leading-tight text-customSecondaryText group-hover/item:text-primary/80 sm:text-xl md:text-3xl',
            {
              'line-clamp-1': addLineClamp,
            },
          )}
          title={addLineClamp ? title : ''}
        >
          {title}
        </h4>
      </button>
    </div>
  );
};

export default SlideItem;
