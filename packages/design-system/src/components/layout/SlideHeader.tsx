interface IProps {
  logoUrl?: string | null;
}

const SlideHeader = ({ logoUrl }: IProps) => {
  if (!logoUrl) return null;

  return (
    <div className="relative top-12 flex w-full items-start md:top-4 2xl:top-24 3xl:top-32 4xl:top-0 5xl:top-48 6xl:top-56 h-xs:top-60 h-sm:top-48 h-md:top-12">
      <img src={logoUrl} alt="agent-logo" className="max-h-16 w-48 object-contain" />
    </div>
  );
};

export default SlideHeader;
