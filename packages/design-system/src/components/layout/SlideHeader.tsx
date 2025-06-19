interface IProps {
  logoUrl?: string | null;
}

const SlideHeader = ({ logoUrl }: IProps) => {
  if (!logoUrl) return null;

  return (
    <div className="relative top-12 flex w-full items-start 2xl:top-24 3xl:top-32 4xl:top-24 5xl:top-48 6xl:top-56">
      <img src={logoUrl} alt="agent-logo" className="max-h-16 w-48 object-contain" />
    </div>
  );
};

export default SlideHeader;
