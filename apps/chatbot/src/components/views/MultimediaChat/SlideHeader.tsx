import HackerEarthLogo from "./HackerEarthLogo";

interface IProps {
  title: string;
  logoUrl?: string;
}

const SlideHeader = ({ title, logoUrl }: IProps) => {
  return (
    <div className="flex w-full items-center justify-between rounded-xl border-2 border-white/50 bg-primary px-4 py-3 text-primary-foreground">
      <div>
        <h1 className="text-sm font-semibold">{title}</h1>
      </div>
      <div>
        {logoUrl ? (
          <img src={logoUrl} alt="logo" className="w-28" />
        ) : (
          <HackerEarthLogo className="w-28" />
        )}
      </div>
    </div>
  );
};

export default SlideHeader;
