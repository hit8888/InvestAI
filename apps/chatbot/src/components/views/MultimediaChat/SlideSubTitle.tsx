interface IProps {
  text: string;
}

const SlideSubTitle = ({ text }: IProps) => {
  return (
    <div>
      <h2 className="max-w-[30ch] text-3xl font-bold leading-relaxed text-primary/90">{text}</h2>
    </div>
  );
};

export default SlideSubTitle;
