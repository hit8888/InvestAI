interface IProps {
  text: string;
}

const SlideSubTitle = ({ text }: IProps) => {
  return (
    <div>
      <h2 className="ui-max-w-[30ch] ui-text-3xl ui-font-medium ui-leading-relaxed ui-text-primary">
        {text}
      </h2>
    </div>
  );
};

export default SlideSubTitle;
