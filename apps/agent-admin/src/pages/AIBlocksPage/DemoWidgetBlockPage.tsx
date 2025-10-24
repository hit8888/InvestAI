import { Block } from '@meaku/core/types/admin/api';
import BlockPageLayout from './components/BlockPageLayout';
import { useBlockPageState } from './hooks/useBlockPageState';
import SectionReadyToDisplayContent from './components/SectionReadyToDisplayContent';
import { SECTION_READY_TO_DISPLAY_CONTENT } from './utils/blockHelpers';

interface DemoWidgetBlockPageProps {
  block: Block;
}

/**
 * DemoWidgetBlockPage - Manages Demo Widget block configuration
 *
 * Uses the generic useBlockPageState hook and BlockPageLayout component
 * for a clean, DRY implementation.
 */
const DemoWidgetBlockPage = ({ block }: DemoWidgetBlockPageProps) => {
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
      key="demo-widget-block-page"
      blockType="Demo Widget"
      blockVisibilityData={blockVisibilityData}
      pageVisibilityRules={pageVisibilityRules}
      onBlockVisibilityChange={handleBlockVisibilityChange}
      onPageVisibilityChange={handlePageVisibilityChange}
      onSave={handleSave}
      moduleSpecificSection={null}
      isLoading={isLoading}
      showDescription={true}
      previewContent={<div className="p-4 text-gray-600">Preview for Demo Widget block</div>}
    >
      <SectionReadyToDisplayContent {...SECTION_READY_TO_DISPLAY_CONTENT.DEMO_LIBRARY} videoCount={0} />
    </BlockPageLayout>
  );
};

export default DemoWidgetBlockPage;
