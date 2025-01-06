interface IProps {
  text: string;
}

const SlideTitle = ({ text }: IProps) => {
  return (
    <div>
      <div className="absolute left-0 z-10 h-7 w-2 bg-primary"></div>
      <h1 className="text-lg font-bold text-primary/90">{text}</h1>
    </div>
  );
};

export default SlideTitle;
