import './index.css';

interface IProps {
  color: string | null;
  text: string;
}

const SamRespondingText = ({ color, text }: IProps) => {
  return (
    <span
      className="text-container text-state"
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

export { SamRespondingText };
