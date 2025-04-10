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
    <div className="group/item w-full rounded-2xl transition-all duration-700">
      <button
        type="button"
        className="slideitem-default-boxshadow hover:slideitem-hover-boxshadow flex h-full w-full cursor-pointer flex-col items-center gap-8 rounded-2xl
        border border-gray-100 bg-white p-4 text-center hover:scale-[101%] hover:border-gray-600 focus:border-gray-600 focus:ring-4 focus:ring-gray-200"
        onClick={handleClick}
      >
        <div className="flex h-20 w-full items-center justify-center rounded-lg border border-gray-100 bg-gray-25 group-hover/item:bg-gray-50">
          <DynamicIcon icon={icon} className="h-12 w-12 text-customPrimaryText" />
        </div>
        <h4
          className={cn(
            'w-full text-center text-lg font-semibold leading-tight text-customSecondaryText sm:text-xl md:text-3xl',
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
