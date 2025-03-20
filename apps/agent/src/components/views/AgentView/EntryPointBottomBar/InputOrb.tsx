import InputWaitingOrb from './InputWaitingOrb';

interface InputOrbProps {
  showOrb: boolean;
  orbLogoUrl?: string;
}

const InputOrb = ({ showOrb, orbLogoUrl }: InputOrbProps) => {
  if (!showOrb) return null;

  return (
    <div className="absolute left-3 top-1/2 z-10 -translate-y-1/2">
      <InputWaitingOrb orbLogoUrl={orbLogoUrl} />
    </div>
  );
};

export default InputOrb;
