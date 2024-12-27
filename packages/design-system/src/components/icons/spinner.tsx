import { cn } from "../../lib/cn";

type Props = React.SVGProps<SVGSVGElement>;

const SpinnerIcon = ({ className = "ui-text-primary", ...props }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "ui-h-6 ui-w-6 ui-animate-spin ui-stroke-current",
        className,
      )}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export default SpinnerIcon;