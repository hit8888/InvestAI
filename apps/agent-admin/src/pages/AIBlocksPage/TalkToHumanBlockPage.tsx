import { Block } from '@neuraltrade/core/types/admin/api';
import BlockPageLayout from './components/BlockPageLayout';
import { useBlockPageState } from './hooks/useBlockPageState';

interface TalkToHumanBlockPageProps {
  block: Block;
}

/**
 * TalkToHumanBlockPage - Manages Talk to Human block configuration
 *
 * Uses the generic useBlockPageState hook and BlockPageLayout component
 * for a clean, DRY implementation.
 */
const TalkToHumanBlockPage = ({ block }: TalkToHumanBlockPageProps) => {
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
      blockType="Talk to Human"
      blockVisibilityData={blockVisibilityData}
      pageVisibilityRules={pageVisibilityRules}
      onBlockVisibilityChange={handleBlockVisibilityChange}
      onPageVisibilityChange={handlePageVisibilityChange}
      onSave={handleSave}
      isLoading={isLoading}
      previewContent={<div className="p-4 text-gray-600">Preview for Talk to Human block</div>}
    />
  );
};

export default TalkToHumanBlockPage;
