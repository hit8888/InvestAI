interface IProps {
  logoUrl?: string | null;
}

const SlideHeader = ({ logoUrl }: IProps) => {
  if (!logoUrl) return null;

  return (
    <div className="flex w-full items-start">
      <img src={logoUrl} alt="agent-logo" className="h-24 w-64 object-contain" />
    </div>
  );
};

export default SlideHeader;
