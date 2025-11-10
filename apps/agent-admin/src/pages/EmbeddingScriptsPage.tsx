import PageContainer from '../components/AgentManagement/PageContainer';
import Card from '../components/AgentManagement/Card.tsx';
import CardItem from '../components/AgentManagement/CardItem.tsx';
import CardTitleAndDescription from '../components/AgentManagement/CardTitleAndDescription.tsx';
import Typography from '@breakout/design-system/components/Typography/index';
import CodeBlock from '@breakout/design-system/components/layout/CodeBlock';
import { useSessionStore } from '../stores/useSessionStore';

const EmbeddingScriptsPage = () => {
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const agentId = useSessionStore((state) => state.activeTenant?.agentId ?? 1);

  const defaultScriptCode = `<script
  async
  src="https://script.getbreakout.ai/command_bar_widget.js"
  tenant-id="${tenantName}"
  agent-id="${agentId}">
</script>`;

  const gtmCompatibleScriptCode = `<script>
(function() {
  var script = document.createElement('script');
  script.setAttribute('src', 'https://script.getbreakout.ai/command_bar_widget.js');
  script.setAttribute('tenant-id', '${tenantName}');
  script.setAttribute('agent-id', '${agentId}');
  script.setAttribute('async', 'true');
  document.head.appendChild(script);
})();
</script>`;

  return (
    <PageContainer heading={'Embedding the Agent Widget'}>
      <Card background={'GRAY25'} border={'GRAY200'}>
        <CardItem className={'flex-col'}>
          <CardTitleAndDescription
            description={
              'Instantly add your Breakout assistant to any webpage with this simple script. Your visitors can get answers and support without leaving your site.'
            }
            isMandatoryField={false}
          />
          <CodeBlock code={defaultScriptCode} language={'html'} />
        </CardItem>
        <CardItem className={'flex-col'}>
          <Typography variant={'caption-12-normal'} className="text-gray-500">
            For tag management systems (Google Tag Manager, etc.) and similar tools: If custom attributes don't work in
            your setup, use this JavaScript code instead:
          </Typography>
          <CodeBlock code={gtmCompatibleScriptCode} language={'html'} />
        </CardItem>
      </Card>
    </PageContainer>
  );
};

export default EmbeddingScriptsPage;
