import LLMsTxtContainer from './LLMsTxtContainer';
import AgentOrbContainer from './AgentOrbContainer';
import AgentColorsContainer from './AgentColorsContainer';
import AgentFontStyleContainer from './AgentFontStyleContainer.tsx';
import AgentLogoAndNameContainer from './AgentLogoAndNameContainer';
import AgentIntroMessageContainer from './AgentIntroMessageContainer.tsx';
import PageContainer from '../../components/AgentManagement/PageContainer.tsx';
import useBrandingPageAgentConfigsQuery from '../../hooks/useBrandingPageAgentConfigsQuery.tsx';

const BrandingPage = () => {
  const { isLoading, hasError, commonProps } = useBrandingPageAgentConfigsQuery();
  return (
    <PageContainer isLoading={isLoading} heading={'Branding'} error={hasError}>
      <AgentIntroMessageContainer {...commonProps} />
      <AgentLogoAndNameContainer {...commonProps} />
      <AgentColorsContainer {...commonProps} />
      <AgentOrbContainer {...commonProps} />
      <AgentFontStyleContainer {...commonProps} />
      <LLMsTxtContainer />
    </PageContainer>
  );
};

export default BrandingPage;
