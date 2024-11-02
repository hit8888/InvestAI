interface IProps {
  text: string;
}

const SlideSubTitle = ({ text }: IProps) => {
  return (
    <div>
      <h2 className="max-w-[30ch] text-3xl font-medium leading-relaxed text-primary">
        {text}
      </h2>
    </div>
  );
};

export default SlideSubTitle;
