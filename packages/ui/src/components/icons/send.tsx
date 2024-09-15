import { cn } from "../../lib/cn";

type Props = React.SVGProps<SVGSVGElement>;

const SendIcon = ({ className = "ui-text-primary", ...props }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("ui-h-6 ui-w-6 ui-fill-current", className)}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M4.4 19.425a.99.99 0 01-.95-.088c-.3-.191-.45-.47-.45-.837V14l8-2-8-2V5.5c0-.367.15-.646.45-.838a.99.99 0 01.95-.087l15.4 6.5c.417.183.625.492.625.925 0 .433-.208.742-.625.925l-15.4 6.5z"></path>
    </svg>
  );
};

export default SendIcon;
