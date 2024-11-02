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
    <div className="ui-flex ui-flex-col ui-items-center ui-gap-3 ui-rounded-md ui-bg-white ui-px-6 ui-py-12 ui-text-center ui-shadow-lg">
      {!!IconComponent && <IconComponent className="ui-h-10 ui-w-10" />}
      <h4 className="ui-text-lg ui-font-medium ui-text-primary">{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default SlideItem;
