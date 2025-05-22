import Typography from '@breakout/design-system/components/Typography/index';
import { ARTIFACTS_SOURCES_TITLE, DEMO_ASSETS_SOURCES_TITLE, KNOWLEDGE_SOURCES_TITLE } from '../constants';
import KnowledgeSourcesIcon from '@breakout/design-system/components/icons/sources-knowledge-icon';
import ArtifactsSourcesIcon from '@breakout/design-system/components/icons/sources-artifacts-icon';
import DemoAssetsSourcesIcon from '@breakout/design-system/components/icons/sources-demo-assets-icon';

type SourcesCardHeaderProps = {
  cardTitle: string;
};

const SourcesCardHeader = ({ cardTitle }: SourcesCardHeaderProps) => {
  const Icon = (() => {
    switch (cardTitle) {
      case KNOWLEDGE_SOURCES_TITLE:
        return KnowledgeSourcesIcon;
      case ARTIFACTS_SOURCES_TITLE:
        return ArtifactsSourcesIcon;
      case DEMO_ASSETS_SOURCES_TITLE:
        return DemoAssetsSourcesIcon;
      default:
        return null;
    }
  })();

  return (
    <div className="flex items-center gap-4">
      {Icon && <Icon className="text-gray-700" height="24" width="24" />}
      <Typography variant="title-18">{cardTitle}</Typography>
    </div>
  );
};

export default SourcesCardHeader;
