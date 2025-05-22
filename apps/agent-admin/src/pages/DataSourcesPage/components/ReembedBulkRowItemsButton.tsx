import { useState } from 'react';
import { SourcesCardTypes } from '../constants';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { reprocessWebpages } from '@meaku/core/adminHttp/api';
import Button from '@breakout/design-system/components/Button/index';
import ReembedIcon from '@breakout/design-system/components/icons/reembed-icon';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { cn } from '@breakout/design-system/lib/cn';

const ReembedBulkRowItemsButton = ({ selectedType }: { selectedType: SourcesCardTypes }) => {
  const { selectedIds, deselectAll } = useDataSourceTableStore();
  const [isReprocessing, setIsReprocessing] = useState(false);
  const queryClient = useQueryClient();

  const areSelectedItems = selectedIds.length > 0;
  const showReembedButton = selectedType === SourcesCardTypes.WEBPAGES && areSelectedItems;

  const handleReembed = async () => {
    if (!areSelectedItems) return;

    try {
      setIsReprocessing(true);
      await reprocessWebpages({
        webpage_ids: selectedIds.map(String),
      });

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

  return (
    <div className="flex items-center justify-end gap-4">
      <TooltipWrapperDark
        tooltipSide="top"
        tooltipAlign="end"
        tooltipSideOffsetValue={15}
        trigger={getReembedButton()}
        showTooltip={showReembedButton}
        content={<p>You can re-embed the selected pages so that the agent can be trained on the updates made</p>}
      />
    </div>
  );
};

export default ReembedBulkRowItemsButton;
