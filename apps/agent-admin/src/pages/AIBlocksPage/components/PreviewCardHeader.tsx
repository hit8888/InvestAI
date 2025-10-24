import PreviewCardActionButtons from './PreviewCardActionButtons';
import { BLOCK_ICONS } from '../utils/blockHelpers';
import { BlockType } from '@meaku/core/types/admin/api';

interface PreviewCardHeaderProps {
  blockType: BlockType;
  blockIcon: string;
  header: string;
}

const PreviewCardHeader = ({ blockType, blockIcon, header }: PreviewCardHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between border-b border-gray-200 px-3 py-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex-shrink-0">
          {blockIcon ? <img src={blockIcon} alt="Summarize" className="h-6 w-6" /> : BLOCK_ICONS[blockType].icon}
        </div>
        <p className="min-w-0 truncate text-base font-medium text-[#272A2E]">{header}</p>
      </div>
      <div className="flex-shrink-0">
        <PreviewCardActionButtons />
      </div>
    </div>
  );
};

export default PreviewCardHeader;
