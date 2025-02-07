interface IProps {
  title: string;
  logoUrl?: string | null;
}

const SlideHeader = ({ title, logoUrl }: IProps) => {
  return (
    <div className="flex w-full items-center justify-between rounded-2xl border-[3px] border-primary/30 bg-primary/10 px-4 py-3 text-primary/70">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      {logoUrl && <div>{<img src={logoUrl} alt="logo" className="w-28" />}</div>}
    </div>
  );
};

export default SlideHeader;
