import { useState } from 'react';
import { SourcesCardTypes } from '../constants';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { bulkProcessDocuments, bulkReprocessArtifacts, reprocessWebpages } from '@neuraltrade/core/adminHttp/api';
import Button from '@breakout/design-system/components/Button/index';
import ReembedIcon from '@breakout/design-system/components/icons/reembed-icon';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { cn } from '@breakout/design-system/lib/cn';
import Typography from '@breakout/design-system/components/Typography/index';

const ReembedBulkRowItemsButton = ({ selectedType }: { selectedType: SourcesCardTypes }) => {
  const { selectedIds, deselectAll } = useDataSourceTableStore();
  const [isReprocessing, setIsReprocessing] = useState(false);
  const queryClient = useQueryClient();

  const areSelectedItems = selectedIds.length > 0;
  const showReembedButton = areSelectedItems;
  const isArtifactsPage = selectedType === SourcesCardTypes.VIDEOS || selectedType === SourcesCardTypes.SLIDES;

  const handleReembed = async () => {
    if (!areSelectedItems) return;

    try {
      setIsReprocessing(true);
      if (selectedType === SourcesCardTypes.WEBPAGES) {
        await reprocessWebpages({
          webpage_ids: selectedIds,
        });
      } else if (selectedType === SourcesCardTypes.DOCUMENTS) {
        await bulkProcessDocuments({
          document_ids: selectedIds,
        });
      } else if (isArtifactsPage) {
        await bulkReprocessArtifacts({
          artifact_ids: selectedIds,
        });
      }

      // Invalidate and refetch the data
      await queryClient.invalidateQueries({ queryKey: ['data-source-table'] });

      // Clear selected items
      deselectAll();

      toast.success('Agent will begin embedding and training on these pages.');
    } catch (error) {
      console.error('Error re-embedding items:', error);
      toast.error('Failed to re-embed selected items');
    } finally {
      setIsReprocessing(false);
    }
  };

  const getReembedButton = () => {
    if (!showReembedButton) return null;
    return (
      <Button variant={'secondary'} buttonStyle={'rightIcon'} onClick={handleReembed} disabled={isReprocessing}>
        {isReprocessing ? 'Processing...' : 'Re-embed'}
        <ReembedIcon width="16" height="16" className={cn('text-primary', isReprocessing && 'animate-spin')} />
      </Button>
    );
  };

  const getTooltipContent = () => {
    return (
      <Typography className="max-w-96" variant={'body-14'} textColor="white">
        You can re-embed the selected pages so that the agent can be trained on the updates made
      </Typography>
    );
  };

  return (
    <div className="flex items-center justify-end gap-4">
      <TooltipWrapperDark
        disableHoverableContent
        tooltipSide="left"
        tooltipAlign="center"
        showArrow={false}
        tooltipSideOffsetValue={15}
        trigger={getReembedButton()}
        showTooltip={showReembedButton}
        content={getTooltipContent()}
      />
    </div>
  );
};

export default ReembedBulkRowItemsButton;
