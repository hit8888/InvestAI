import HackerEarthLogo from "../icons/HackerEarthLogo";

interface IProps {
  title: string;
  logoUrl?: string | null;
}

const SlideHeader = ({ title, logoUrl }: IProps) => {
  return (
    <div className="flex w-full items-center justify-between rounded-xl border-2 border-white/50 bg-primary/10 px-4 py-3 text-primary/70">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      <div>
        {logoUrl ? (
          <img src={logoUrl} alt="logo" className="w-28" />
        ) : (
          <HackerEarthLogo className="w-56 fill-primary" />
        )}
      </div>
    </div>
  );
};

export default SlideHeader;
