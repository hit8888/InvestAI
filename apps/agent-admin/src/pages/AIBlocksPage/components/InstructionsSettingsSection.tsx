import Card from '../../../components/AgentManagement/Card';
import SinglePromptTextarea from '../../ControlsPage/SinglePromptTextarea';
import { CommonControls, ControlsTitleEnum } from '../../ControlsPage/utils';

const { INSTRUCTIONS } = ControlsTitleEnum;

const InstructionsSettingsSection = ({ id }: { id?: string }) => {
  const instructions = CommonControls.find((control) => control.title === INSTRUCTIONS)!;
  return (
    <div id={id} className="w-full">
      <Card className="w-full" background="GRAY25" border="GRAY200">
        <SinglePromptTextarea key={INSTRUCTIONS} {...instructions} />
      </Card>
    </div>
  );
};

export default InstructionsSettingsSection;
