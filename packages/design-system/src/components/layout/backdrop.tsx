import { cn } from "../../lib/cn";

type Props = React.PropsWithChildren<{
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}>;

const Backdrop = (props: Props) => {
  const { children, className } = props;

  return (
    <div
      className={cn(
        "fixed inset-0 h-screen overflow-hidden bg-black/30",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Backdrop;
