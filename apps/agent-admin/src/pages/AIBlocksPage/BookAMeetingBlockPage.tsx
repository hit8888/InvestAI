import { Block } from '@meaku/core/types/admin/api';
import BlockPageLayout from './components/BlockPageLayout';
import { useBlockPageState } from './hooks/useBlockPageState';
import BookMeetingBlockPreview from './BookMeetingBlockPreview';
// import BookMeetingFormFieldsSection from './BookMeetingFormFieldsSection';
// import { useCallback, useState } from 'react';

interface BookAMeetingBlockPageProps {
  block: Block;
}

/**
 * BookAMeetingBlockPage - Manages Book a Meeting block configuration
 *
 * Uses the generic useBlockPageState hook and BlockPageLayout component
 * for a clean, DRY implementation.
 *
 * Real-time Preview Integration:
 * - Passes blockVisibilityData to BookMeetingBlockPreview
 * - Preview updates instantly when user changes title, description, or icon
 */
const BookAMeetingBlockPage = ({ block }: BookAMeetingBlockPageProps) => {
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

  // const [formSubmitCTAName, setFormSubmitCTAName] = useState('Talk to Human');

  // const handleOnFormSubmitCTANameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormSubmitCTAName(e.target.value);
  // }, []);

  return (
    <BlockPageLayout
      blockType="Book a Meeting"
      blockVisibilityData={blockVisibilityData}
      pageVisibilityRules={pageVisibilityRules}
      onBlockVisibilityChange={handleBlockVisibilityChange}
      onPageVisibilityChange={handlePageVisibilityChange}
      onSave={handleSave}
      isLoading={isLoading}
      showDescription={true}
      block={block}
      // moduleSpecificSection={
      //   <BookMeetingFormFieldsSection
      //     disabled={isLoading}
      //     formSubmitCTAName={formSubmitCTAName}
      //     handleOnFormSubmitCTANameChange={handleOnFormSubmitCTANameChange}
      //   />
      // }
      previewContent={
        <BookMeetingBlockPreview
          description={blockVisibilityData.description}
          iconUrl={blockVisibilityData.iconUrl}
          headerText={blockVisibilityData.title}
          ctaLabel={'Talk to Human'}
        />
      }
      previewContainerClassname="min-h-[150px] w-96 min-w-[40%] bg-white"
    />
  );
};

export default BookAMeetingBlockPage;
