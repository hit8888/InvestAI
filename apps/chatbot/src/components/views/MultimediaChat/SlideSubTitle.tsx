interface IProps {
  text: string;
}

const SlideSubTitle = ({ text }: IProps) => {
  return (
    <div className="col-span-3 flex h-full items-center">
      <div className="flex gap-16">
        <div className="w-2 rounded-lg bg-secondary" />
        <h2 className="border-secondary text-6xl font-bold leading-snug text-primary">{text}</h2>
      </div>
    </div>
  );
};

export default SlideSubTitle;
