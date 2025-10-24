import Card from '../../../components/AgentManagement/Card';
import CardTitleAndDescription from '../../../components/AgentManagement/CardTitleAndDescription';

const MessageSoundSettingsSection = () => {
  return (
    <Card background="GRAY25" border="GRAY200">
      <CardTitleAndDescription
        title="Message Sound"
        description="Choose the sound you’ll hear when the AI agent sends a new message."
      />
    </Card>
  );
};

export default MessageSoundSettingsSection;
