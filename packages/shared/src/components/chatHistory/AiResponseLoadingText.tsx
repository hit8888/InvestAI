interface IProps {
  color: string | null;
  text: string;
}

const AiResponseLoadingText = ({ color, text }: IProps) => {
  return (
    <span
      className="text-sm font-normal leading-6 bg-gradient-to-r from-[var(--input-color,var(--fallback-color))] to-[#e0e5ea] bg-clip-text text-transparent bg-[length:200%_100%] animate-text-state"
      style={
        {
          '--input-color': color ?? 'rgb(var(--primary))',
          '--fallback-color': color ?? 'rgb(var(--primary))',
        } as React.CSSProperties
      }
    >
      {text}
    </span>
  );
};

export { AiResponseLoadingText };
