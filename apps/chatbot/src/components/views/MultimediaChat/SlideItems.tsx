import { cn } from "@breakout/design-system/lib/cn";
import { SlideArtifactType } from "@meaku/core/types/chat";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import SlideItem from "./SlideItem";

interface IProps {
  items: SlideArtifactType["items"];
}

const SlideItems = (props: IProps) => {
  const { items } = props;
  const itemsLength = items.length;

  return (
    <>
      <div
        className={cn("mt-auto grid gap-3", {
          "grid-cols-4": itemsLength >= 4,
          "grid-cols-1": itemsLength === 1,
          // [Math.random() > 0.5 ? "grid-cols-2" : "grid-cols-4"]:
          // itemsLength === 2,
          "grid-cols-2": itemsLength === 2,
          "grid-cols-3": itemsLength === 3,
        })}
      >
        {items.map((item) => (
          <SlideItem
            title={item.title}
            description={item.description}
            icon={item.icon as keyof typeof dynamicIconImports}
            key={item.title}
          />
        ))}
      </div>
      {/* DO NOT REMOVE THIS SPAN, THIS IS THERE SO THAT THE TAILWIND CLASSES ARE PRESENT FOR US TO USE THEM DYNAMICALLY */}
      <span className="hidden grid-cols-2 grid-cols-3 grid-cols-3 grid-cols-4"></span>
    </>
  );
};

export default SlideItems;
