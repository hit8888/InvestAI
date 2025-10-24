import { Block } from '@meaku/core/types/admin/api';
import BlockPageLayout from './components/BlockPageLayout';
import { useBlockPageState } from './hooks/useBlockPageState';
import SummarizeBlockPreview from './SummarizeBlockPreview';

interface SummarizeBlockPageProps {
  block: Block;
}

/**
 * SummarizeBlockPage - Manages Summarize block configuration
 *
 * Uses the generic useBlockPageState hook and BlockPageLayout component
 * for a clean, DRY implementation.
 *
 * Real-time Preview Integration:
 * - Passes blockVisibilityData to SummarizeBlockPreview
 * - Preview updates instantly when user changes title, description, or icon
 */
const SummarizeBlockPage = ({ block }: SummarizeBlockPageProps) => {
  const {
    blockVisibilityData,
    pageVisibilityRules,
    handleBlockVisibilityChange,
    handlePageVisibilityChange,
    handleSave,
    isLoading,
  } = useBlockPageState({
    block,
  });

  return (
    <BlockPageLayout
      blockType="Summarize"
      blockVisibilityData={blockVisibilityData}
      pageVisibilityRules={pageVisibilityRules}
      onBlockVisibilityChange={handleBlockVisibilityChange}
      onPageVisibilityChange={handlePageVisibilityChange}
      onSave={handleSave}
      isLoading={isLoading}
      showDescription={true}
      previewContent={
        <SummarizeBlockPreview
          description={blockVisibilityData.description}
          iconUrl={blockVisibilityData.iconUrl}
          headerText={blockVisibilityData.title}
          ctaLabel="Summarize This Page"
        />
      }
      previewContainerClassname="min-h-[150px] w-96 min-w-[40%] bg-white"
    />
  );
};

export default SummarizeBlockPage;
