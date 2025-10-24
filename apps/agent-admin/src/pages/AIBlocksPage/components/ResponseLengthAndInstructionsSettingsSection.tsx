import Card from '../../../components/AgentManagement/Card';
import AgentResponseWordCount from '../../ControlsPage/AgentResponseWordCount';
import SinglePromptTextarea from '../../ControlsPage/SinglePromptTextarea';
import { CommonControls, ControlsTitleEnum } from '../../../pages/ControlsPage/utils';
import SeparatorLine from './SeparatorLine';

const { INSTRUCTIONS, AGENT_RESPONSE_LENGTH } = ControlsTitleEnum;

const ResponseLengthAndInstructionsSettingsSection = () => {
  const instructions = CommonControls.find((control) => control.title === INSTRUCTIONS)!;
  const agentResponseWordCount = CommonControls.find((control) => control.title === AGENT_RESPONSE_LENGTH)!;
  return (
    <Card className="w-full" background="GRAY25" border="GRAY200">
      <AgentResponseWordCount {...agentResponseWordCount} />
      <SeparatorLine />
      <SinglePromptTextarea key={INSTRUCTIONS} {...instructions} />
    </Card>
  );
};

export default ResponseLengthAndInstructionsSettingsSection;
