interface IProps {
  text: string;
}

const SlideSubTitle = ({ text }: IProps) => {
  return (
    <div className="flex h-full w-1/2 items-center">
      <div className="flex gap-8">
        <div className="w-4 rounded-lg bg-secondary" />
        <h2 className="border-secondary text-6xl font-bold leading-snug text-customPrimaryText">{text}</h2>
      </div>
    </div>
  );
};

export default SlideSubTitle;
