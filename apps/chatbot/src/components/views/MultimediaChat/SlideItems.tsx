import { SlideArtifactType } from "@meaku/core/types/chat";
import { cn } from "@meaku/ui/lib/cn";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import SlideItem from "./SlideItem";

interface IProps {
  items: SlideArtifactType["items"];
}

// className="ui-mt-auto ui-grid ui-grid-cols-4 ui-gap-3"

const SlideItems = (props: IProps) => {
  const { items } = props;
  const itemsLength = items.length;

  return (
    <>
      <div
        className={cn("ui-mt-auto ui-grid", {
          "ui-grid-cols-4": itemsLength >= 4,
          [`ui-grid-cols-${itemsLength}`]: itemsLength < 4,
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
      <span className="ui-hidden ui-grid-cols-2 ui-grid-cols-3 ui-grid-cols-3 ui-grid-cols-4"></span>
    </>
  );
};

export default SlideItems;
