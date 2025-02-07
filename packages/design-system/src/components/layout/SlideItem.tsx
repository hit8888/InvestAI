import dynamicIconImports from 'lucide-react/dynamicIconImports';
import DynamicIcon from '../icons/DynamicIcon';

interface IProps {
  icon: keyof typeof dynamicIconImports;
  title: string;
  onClick: (title: string) => void;
}

const SlideItem = ({ icon, title, onClick }: IProps) => {
  const handleClick = () => {
    onClick(title);
  };

  return (
    <div className='group/item slideitem-default-boxshadow rounded-[25px] bg-gray/20'>
      <div
          className="flex h-full w-full scale-100 cursor-pointer flex-col items-center gap-8 rounded-xl border border-primary/25 bg-white p-4 text-center shadow-md hover:shadow-2xl  md:scale-95 lg:scale-90"
          onClick={handleClick}
        >
          <div className="flex h-20 w-full group-hover/item:bg-primary/10 group-hover/item:border-primary/40 items-center justify-center rounded-xl border border-primary/10 bg-primary/2.5">
            <DynamicIcon icon={icon} className="h-12 w-12 text-customPrimaryText group-hover/item:text-primary" />
          </div>
          <h4 className="text-3xl font-semibold leading-relaxed text-customSecondaryText group-hover/item:text-primary/80">{title}</h4>
        </div>
    </div>
  );
};

export default SlideItem;
