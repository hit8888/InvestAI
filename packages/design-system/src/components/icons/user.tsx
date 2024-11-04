import { cn } from "../../lib/cn";

type Props = React.SVGProps<SVGSVGElement>;

const UserAvatarIcon = ({ className = "text-primary", ...props }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6 fill-current", className)}
      fill="none"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="#EAECF0"
        d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16z"
      ></path>
      <path
        fill="#98A2B3"
        d="M26.052 27.563v.886A15.93 15.93 0 0116 32c-3.808 0-7.305-1.33-10.051-3.55v-.887a8.661 8.661 0 018.66-8.66h2.782a8.66 8.66 0 018.66 8.66zM16 16.562a5.315 5.315 0 100-10.63 5.315 5.315 0 000 10.63z"
      ></path>
    </svg>
  );
};

export default UserAvatarIcon;
