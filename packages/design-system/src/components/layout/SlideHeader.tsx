interface IProps {
  logoUrl?: string | null;
}

const SlideHeader = ({ logoUrl }: IProps) => {
  if (!logoUrl) return null;

  return (
    <div className="relative top-16 flex w-full items-start 2xl:top-36">
      <img src={logoUrl} alt="agent-logo" className="max-h-16 w-48 object-contain" />
    </div>
  );
};

export default SlideHeader;
