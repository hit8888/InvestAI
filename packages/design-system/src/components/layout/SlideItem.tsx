import dynamicIconImports from 'lucide-react/dynamicIconImports';
import DynamicIcon from '../icons/DynamicIcon';
import { cn } from '../../lib/cn';
import Typography from '../Typography';

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
    <div
      className="group/item h-full w-full animate-gradient-sweep rounded-2xl p-[0.2rem] transition-all"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, transparent 40%, rgba(156, 163, 175, 0.6) 50%, transparent 60%, transparent 100%)',
        backgroundSize: '300% 100%',
        backgroundPosition: '100% 50%',
      }}
    >
      <button
        type="button"
        className="slideitem-default-boxshadow hover:slideitem-hover-boxshadow flex h-full w-full cursor-pointer flex-col items-center gap-8 rounded-2xl
        border border-gray-100 bg-white p-4 text-center ring-system hover:scale-[101%] hover:border-gray-600 focus:border-gray-600"
        onClick={handleClick}
      >
        <div className="flex h-20 w-full items-center justify-center rounded-lg border border-gray-100 bg-gray-25 group-hover/item:bg-gray-50">
          <DynamicIcon icon={icon} className="h-12 w-12 text-customPrimaryText" />
        </div>
        <Typography
          as="h4"
          variant="title-18"
          align="center"
          textColor="textSecondary"
          className={cn('flex w-full flex-1 items-center justify-center sm:text-xl md:text-2xl', {
            'line-clamp-1': addLineClamp,
          })}
          title={addLineClamp ? title : ''}
        >
          {title}
        </Typography>
      </button>
    </div>
  );
};

export default SlideItem;
