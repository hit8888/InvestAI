import { cn } from "@breakout/design-system/lib/cn";
import { LucideIcon, LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { useEffect, useState } from "react";

interface IProps extends LucideProps {
  icon: keyof typeof dynamicIconImports;
  fallbackIcon?: keyof typeof dynamicIconImports;
  className?: HTMLDivElement["className"];
}

const DynamicIcon = (props: IProps) => {
  const { icon, fallbackIcon = "circle-help", className, ...restProps } = props;

  const [Icon, setIcon] = useState<LucideIcon | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const importIcon = async () => {
      try {
        setError(false);

        const imported = (await import("lucide-react")) as unknown as {
          [key: string]: LucideIcon;
        };
        const iconComponent = imported[icon];

        if (iconComponent) {
          setIcon(() => iconComponent);
        } else {
          console.warn(`Icon "${icon}" not found in lucide-react`);
          setError(true);
        }
      } catch (err) {
        console.warn(`Error loading icon "${icon}":`, err);
        setError(true);
      }
    };

    importIcon();
  }, [icon]);

  if (error) {
    return <DynamicIcon icon={fallbackIcon} {...restProps} />;
  }

  if (!Icon) {
    return <div className="h-10 w-10 animate-pulse rounded bg-gray-200" />;
  }

  return <Icon className={cn(className)} {...restProps} />;
};

export default DynamicIcon;
