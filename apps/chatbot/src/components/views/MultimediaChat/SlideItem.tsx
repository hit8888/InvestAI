import dynamicIconImports from 'lucide-react/dynamicIconImports';
import DynamicIcon from './DynamicIcon';

interface IProps {
  icon: keyof typeof dynamicIconImports;
  title: string;
}

const SlideItem = (props: IProps) => {
  const { icon, title } = props;

  return (
    <div className="flex h-full w-full flex-col items-center gap-7 rounded-xl border border-primary/25 bg-white p-4 text-center shadow-xl">
      <div className="flex h-16 w-full items-center justify-center rounded-xl border border-primary/10 bg-primary/5">
        <DynamicIcon icon={icon} className="h-10 w-10 text-primary" />
      </div>
      <h4 className="text-2xl font-semibold text-primary/80">{title}</h4>
    </div>
  );
};

export default SlideItem;
