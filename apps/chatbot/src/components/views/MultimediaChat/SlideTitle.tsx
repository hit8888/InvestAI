interface IProps {
  text: string;
}

const SlideTitle = ({ text }: IProps) => {
  return (
    <div>
      <div className="ui-absolute ui-left-0 ui-z-10 ui-h-7 ui-w-2 ui-bg-primary"></div>
      <h1 className="ui-text-lg ui-font-medium ui-text-primary">{text}</h1>
    </div>
  );
};

export default SlideTitle;
