import { useMessageStore } from '../../../../stores/useMessageStore';

interface IProps {
  handleOpenAgent: () => void;
}

const InsetAgentOpenButton = ({ handleOpenAgent }: IProps) => {
  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  if (!hasFirstUserMessageBeenSent) return null;

  return <button className="absolute inset-0 z-50 rounded-xl" onClick={handleOpenAgent}></button>;
};

export default InsetAgentOpenButton;
