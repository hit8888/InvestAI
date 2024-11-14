interface IProps {
  text: string;
}

const SlideSubTitle = ({ text }: IProps) => {
  return (
    <div className="col-span-2 flex h-full items-center">
      <div className="flex gap-8">
        <div className="w-2 rounded-lg bg-secondary" />
        <h2 className="max-w-[18ch] border-secondary text-2xl font-bold leading-relaxed text-primary 2xl:max-w-[20ch] 2xl:text-3xl 2xl:leading-relaxed">
          {text}
        </h2>
      </div>
    </div>
  );
};

export default SlideSubTitle;
