interface IProps {
  buttonText: string;
  onClick: () => void;
  children?: React.ReactNode;
}

const ActionButton = ({ buttonText, onClick, children }: IProps) => {
  return (
    <button
      onClick={onClick}
      className={
        'flex items-center justify-center rounded-lg border-2 border-[rgb(var(--secondary)/0.24)] bg-primary/90 p-3 hover:bg-primary'
      }
    >
      <span className="flex items-center gap-2 text-base font-semibold text-white">
        {buttonText}
        {children}
      </span>
    </button>
  );
};

export { ActionButton };
