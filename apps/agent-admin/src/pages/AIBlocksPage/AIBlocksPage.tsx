import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@breakout/design-system/components/Typography/index';
import { AIBlockCard } from '@breakout/design-system/components/AIBlockCard/index';
import { useBlocksData } from './hooks/useBlocksData';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { getBlockUIConfig, getBlockCardStatus } from './utils/blockHelpers';
import GlobalSettingsContainer from './GlobalSettingsContainer';
import Button from '@breakout/design-system/components/Button/index';
import { Eye } from 'lucide-react';

const CURRENT_BLOCK = ['ASK_AI', 'BOOK_MEETING', 'VIDEO_LIBRARY', 'SUMMARIZE'];

/**
 * Blocks Page Component
 * Displays a list of all blocks for an agent with their current status
 * Integrates with the API to fetch real-time block data
 */
const AIBlocksPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch blocks data using the custom hook
  const { blocks, isLoadingBlocks, blocksError } = useBlocksData();

  // sorted by block id
  const sortedBlocks = blocks
    ? [...blocks].filter((block) => CURRENT_BLOCK.includes(block.type)).sort((a, b) => a.id - b.id)
    : [];

  const handleNavigationFromBlocks = (path: string) => {
    const newPath = location.pathname.substring(0, location.pathname.indexOf('/blocks')) + path;
    navigate(newPath);
  };

  /**
   * Handle block card click - navigate to block detail page
   */
  const handleBlockClick = (blockId: number) => {
    handleNavigationFromBlocks(`/blocks/${blockId}`);
  };

  const handlePreviewClick = () => {
    handleNavigationFromBlocks('/training/playground');
  };

  // Loading state
  if (isLoadingBlocks) {
    return <LoadingState />;
  }

  // Error state
  if (blocksError) {
    return <ErrorState onRetry={() => window.location.reload()} />;
  }

  // Empty state
  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex w-full flex-col gap-6 p-4">
        <div className="flex-1 flex-col gap-2">
          <Typography variant="title-18">Blocks</Typography>
          <Typography variant="body-14" textColor="gray500">
            Manage and configure your website engagement blocks
          </Typography>
        </div>
        <div className="flex min-h-[400px] w-full items-center justify-center rounded-3xl border border-gray-200 bg-gray-25 p-12">
          <div className="flex flex-col items-center gap-2 text-center">
            <Typography variant="title-18" textColor="textPrimary">
              No Blocks found
            </Typography>
            <Typography variant="body-14" textColor="gray500">
              There are no blocks configured for this agent yet.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render blocks
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex-1 flex-col gap-2">
          <Typography className="font-bold" variant="title-24">
            Blocks
          </Typography>
          <Typography variant="body-14" textColor="gray500">
            Manage and configure your website engagement blocks
          </Typography>
        </div>
        <Button
          onClick={handlePreviewClick}
          type="button"
          variant="primary"
          buttonStyle="rightIcon"
          rightIcon={<Eye className="h-4 w-4" />}
        >
          Preview
        </Button>
      </div>
      <div className="flex w-full items-start gap-6">
        <div className="flex w-full flex-1 flex-col items-start gap-6">
          {sortedBlocks?.map((block) => {
            const uiConfig = getBlockUIConfig(block.type);
            const status = getBlockCardStatus(block.is_active);

            return (
              <AIBlockCard
                key={block.id}
                icon={uiConfig.icon}
                showImage={block.type === 'ASK_AI'}
                title={block.name}
                description={uiConfig.description}
                status={status}
                separatorColor={uiConfig.separatorColor}
                onClick={() => handleBlockClick(block.id)}
              />
            );
          })}
        </div>
        <GlobalSettingsContainer />
      </div>
    </div>
  );
};

export default AIBlocksPage;
