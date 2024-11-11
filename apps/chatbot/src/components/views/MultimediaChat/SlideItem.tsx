import dynamicIconImports from 'lucide-react/dynamicIconImports';
import DynamicIcon from './DynamicIcon';

interface IProps {
  icon?: keyof typeof dynamicIconImports;
  title: string;
  description: string;
}

const SlideItem = (props: IProps) => {
  const { icon, title, description } = props;

  return (
    <div className="flex flex-col items-center gap-3 rounded-md bg-white px-6 py-12 text-center shadow-lg">
      {icon && <DynamicIcon icon={icon} />}
      <h4 className="text-lg font-semibold text-primary">{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default SlideItem;
