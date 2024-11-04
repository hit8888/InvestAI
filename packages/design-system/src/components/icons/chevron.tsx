import { cn } from "../../lib/cn";

type Props = React.SVGProps<SVGSVGElement>;

const ChevronIcon = ({ className = "text-primary", ...props }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-4 fill-current", className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.2 14c-.15 0-.27-.05-.362-.15a.502.502 0 01-.138-.35c0-.033.05-.15.15-.35l3.625-3.625a.762.762 0 01.25-.175A.734.734 0 0112 9.3c.1 0 .192.017.275.05a.762.762 0 01.25.175l3.625 3.625a.471.471 0 01.15.35c0 .133-.046.25-.137.35a.468.468 0 01-.363.15H8.2z"
      ></path>
    </svg>
  );
};

export default ChevronIcon;
