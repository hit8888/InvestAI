import { cn } from "../../lib/cn";

type Props = React.PropsWithChildren<{
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}>;

const Backdrop = (props: Props) => {
  const { children, className } = props;

  return (
    <div
      className={cn(
        "ui-fixed ui-inset-0 ui-h-screen ui-overflow-hidden ui-bg-black/30",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Backdrop;
