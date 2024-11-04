import dynamicIconImports from "lucide-react/dynamicIconImports";
import { lazy, Suspense, useMemo } from "react";

interface IProps {
  icon?: keyof typeof dynamicIconImports;
  title: string;
  description: string;
}

const SlideItem = (props: IProps) => {
  const { icon, title, description } = props;
  console.log("🚀 ~ file: SlideItem.tsx:11 ~ SlideItem ~ icon:", icon);

  const IconComponent = useMemo(() => {
    if (!icon) return null;

    try {
      return lazy(dynamicIconImports[icon]);
    } catch (error) {
      console.log(
        "🚀 ~ file: SlideItem.tsx:20 ~ IconComponent ~ error:",
        error,
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 rounded-md bg-white px-6 py-12 text-center shadow-lg">
      {!!IconComponent && (
        <Suspense
          fallback={<div className="h-10 w-10 animate-pulse bg-gray-300" />}
        >
          <IconComponent className="h-10 w-10" />
        </Suspense>
      )}
      <h4 className="text-lg font-medium text-primary">{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default SlideItem;
