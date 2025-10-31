import { ReactNode } from 'react';
import BlockVisibilityContent, { BlockVisibilityData } from './BlockVisibilityContent';
import BlockPreviewContainer from './BlockPreviewContainer';
import PageLevelVisibility, { PageVisibilityItem } from './PageLevelVisibility';
import { Block } from '@meaku/core/types/admin/api';

export interface BlockPageLayoutProps {
  /** Block type name (e.g., "Ask AI", "Book a Meeting") */
  blockType: string;

  /** Block visibility data */
  blockVisibilityData: BlockVisibilityData;

  /** Page-level visibility rules */
  pageVisibilityRules: PageVisibilityItem[];

  /** Handler for block visibility changes */
  onBlockVisibilityChange: (data: BlockVisibilityData) => void;

  /** Handler for page visibility changes */
  onPageVisibilityChange: (data: PageVisibilityItem[]) => void;

  /** Handler for manual save (used by PageLevelVisibility) */
  onSave: (data?: {
    pageVisibilityRules?: PageVisibilityItem[];
    blockVisibilityData?: BlockVisibilityData;
  }) => Promise<void> | void;

  /** Whether the component is in loading/updating state */
  isLoading?: boolean;

  /** Optional: Block-specific configuration section */
  moduleSpecificSection?: ReactNode;

  /** Optional: Custom preview content */
  previewContent?: ReactNode;

  /** Optional: Maximum length for the block title */
  blockTitleMaxLength?: number;

  /** Optional: Whether to show the description field in BlockVisibilityContent */
  showDescription?: boolean;

  /** Optional: Whether to show the PageLevelVisibility section */
  showPageLevelVisibility?: boolean;

  /** Optional: Custom className for the container */
  className?: string;
  previewContainerClassname?: string;
  outerClassname?: string;
  children?: React.ReactNode;
  block?: Block;
}

/**
 * Reusable layout component for block pages
 *
 * This component provides a consistent layout structure for all block pages:
 * - Left side: Configuration sections (Block Visibility, Module-specific, Page Visibility)
 * - Right side: Preview container
 *
 * @example
 * ```tsx
 * <BlockPageLayout
 *   blockType="Ask AI"
 *   blockVisibilityData={blockVisibilityData}
 *   pageVisibilityRules={pageVisibilityRules}
 *   onBlockVisibilityChange={handleBlockVisibilityChange}
 *   onPageVisibilityChange={handlePageVisibilityChange}
 *   onSave={handleSave}
 *   isLoading={isLoading}
 *   moduleSpecificSection={
 *     <AskAISpecificSection
 *       initialData={moduleConfig}
 *       onChange={handleModuleConfigChange}
 *       isLoading={isLoading}
 *     />
 *   }
 *   previewContent={<div>Preview here</div>}
 * />
 * ```
 */
const BlockPageLayout = ({
  blockType,
  blockVisibilityData,
  pageVisibilityRules,
  onBlockVisibilityChange,
  onPageVisibilityChange,
  onSave,
  isLoading = false,
  moduleSpecificSection,
  previewContent,
  blockTitleMaxLength,
  showDescription = false,
  showPageLevelVisibility = true,
  className = '',
  previewContainerClassname,
  outerClassname,
  children,
  block,
}: BlockPageLayoutProps) => {
  return (
    <div className={`flex w-full items-start gap-6 self-stretch ${className}`}>
      {/* Left Side - Configuration Sections */}
      <div className="flex w-full max-w-[60%] flex-col gap-8 pb-4">
        {/* Block Visibility Section */}
        <BlockVisibilityContent
          initialData={blockVisibilityData}
          onChange={onBlockVisibilityChange}
          onSave={onSave}
          blockType={blockType}
          isLoading={isLoading}
          disabled={isLoading}
          showDescription={showDescription}
          blockTitleMaxLength={blockTitleMaxLength}
          block={block}
        />

        {/* Module-Specific Section (if provided) */}
        {moduleSpecificSection}

        {/* Page Level Visibility Section */}
        {showPageLevelVisibility && (
          <PageLevelVisibility
            data={pageVisibilityRules}
            onChange={onPageVisibilityChange}
            onSave={onSave}
            isLoading={isLoading}
            disabled={isLoading}
          />
        )}
        {children}
      </div>

      {/* Right Side - Preview Container */}
      <BlockPreviewContainer outerClassname={outerClassname} className={previewContainerClassname}>
        {previewContent}
      </BlockPreviewContainer>
    </div>
  );
};

export default BlockPageLayout;
