interface IProps {
  logoUrl?: string | null;
}

const SlideHeader = ({ logoUrl }: IProps) => {
  return (
    <div className="flex w-full items-center justify-start rounded-2xl py-3">
      {logoUrl && <div>{<img src={logoUrl} alt="logo" className="max-h-10 w-28 object-contain" />}</div>}
    </div>
  );
};

export default SlideHeader;
