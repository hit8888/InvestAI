interface IProps {
  logoUrl?: string | null;
}

const SlideHeader = ({ logoUrl }: IProps) => {
  if (!logoUrl) return null;

  return (
    <div className="flex w-full items-center justify-start rounded-2xl py-3">
      <img src={logoUrl} alt="logo" className="max-h-10 w-28 object-contain" />
    </div>
  );
};

export default SlideHeader;
