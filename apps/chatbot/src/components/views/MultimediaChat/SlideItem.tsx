import dynamicIconImports from "lucide-react/dynamicIconImports";
import { lazy } from "react";

interface IProps {
  icon?: keyof typeof dynamicIconImports;
  title: string;
  description: string;
}

const SlideItem = (props: IProps) => {
  const { icon, title, description } = props;

  const IconComponent = icon ? lazy(dynamicIconImports[icon]) : null;

  return (
    <div className="flex flex-col items-center gap-3 rounded-md bg-white px-6 py-12 text-center shadow-lg">
      {!!IconComponent && <IconComponent className="h-10 w-10" />}
      <h4 className="text-lg font-medium text-primary">{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default SlideItem;
