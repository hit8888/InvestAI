import { useParams } from 'react-router-dom';
import { getTenantActiveAgentId } from '@meaku/core/utils/index';
import useBlockQuery from '../../queries/query/useBlockQuery';
import AskAiBlockPage from './AskAiBlockPage';
import BookAMeetingBlockPage from './BookAMeetingBlockPage';
import SummarizeBlockPage from './SummarizeBlockPage';
import VideoLibraryBlockPage from './VideoLibraryBlockPage';
import TalkToHumanBlockPage from './TalkToHumanBlockPage';
import DemoWidgetBlockPage from './DemoWidgetBlockPage';
import ErrorState from './components/ErrorState';
import { BlockType, Block } from '@meaku/core/types/admin/api';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import BlockPreviewContainer from './components/BlockPreviewContainer';
import AIBlocksNavigation from './AIBlocksNavigation';

/**
 * Dynamic Block Page Router
 * Fetches block data and renders the appropriate block detail page based on block type
 */
const DynamicBlockPage = () => {
  const { blockId } = useParams<{ blockId: string }>();
  const agentId = getTenantActiveAgentId();

  const {
    data: block,
    isLoading,
    error,
    refetch,
  } = useBlockQuery({
    agentId: agentId!,
    blockId: Number(blockId),
    enabled: !!agentId && !!blockId,
  });

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !block) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  // Render appropriate page based on block type
  const renderBlockPage = () => {
    // Map block types to their respective page components
    // Each component receives the block data as a prop
    const blockTypeMap: Record<BlockType, React.ComponentType<{ block: Block }>> = {
      ASK_AI: AskAiBlockPage,
      BOOK_MEETING: BookAMeetingBlockPage,
      SUMMARIZE: SummarizeBlockPage,
      VIDEO_LIBRARY: VideoLibraryBlockPage,
      TALK_TO_HUMAN: TalkToHumanBlockPage,
      IFRAME: DemoWidgetBlockPage,
      DEMO_LIBRARY: DemoWidgetBlockPage,
    };

    const PageComponent = blockTypeMap[block.type];

    if (!PageComponent) {
      return <ErrorState message={`Unsupported block type: ${block.type}`} />;
    }
    // Add key with block.type to force React to unmount/remount when switching between different block types
    // This prevents state bleeding between different block page components
    return (
      <>
        <AIBlocksNavigation blockCategory={block.type} />
        <PageComponent key={`${block.type}-${block.id}`} block={block} />
      </>
    );
  };

  return renderBlockPage();
};

const LoadingState = () => {
  return (
    <div className="flex w-full items-start gap-6 self-stretch pt-6">
      <div className="flex w-full max-w-xl flex-col gap-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
      <BlockPreviewContainer>
        <Skeleton className="h-[600px] w-full" />
      </BlockPreviewContainer>
    </div>
  );
};

export default DynamicBlockPage;
