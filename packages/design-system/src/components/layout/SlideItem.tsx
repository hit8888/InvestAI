import dynamicIconImports from 'lucide-react/dynamicIconImports';
import DynamicIcon from '../icons/DynamicIcon';

interface IProps {
  icon: keyof typeof dynamicIconImports;
  title: string;
}

const SlideItem = (props: IProps) => {
  const { icon, title } = props;

  return (
    <div className="flex h-full w-full scale-100 flex-col items-center gap-8 rounded-xl border border-primary/25 bg-white p-4 text-center shadow-xl md:scale-95 lg:scale-90">
      <div className="flex h-20 w-full items-center justify-center rounded-xl border border-primary/10 bg-primary/5">
        <DynamicIcon icon={icon} className="h-12 w-12 text-primary" />
      </div>
      <h4 className="text-3xl font-semibold leading-relaxed text-primary/80">{title}</h4>
    </div>
  );
};

export default SlideItem;
