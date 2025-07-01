import { useState } from 'react';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import { SourcesCardTypes } from '../constants';
import { useQueryClient } from '@tanstack/react-query';
import { deleteArtifacts, deleteDocuments, deleteWebpages } from '@meaku/core/adminHttp/api';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogTrigger } from '@breakout/design-system/components/layout/dialog';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import { DeleteArtifactsResponse, DeleteDocumentsResponse, DeleteWebpagesResponse } from '@meaku/core/types/admin/api';

const DeleteBulkRowItemsButton = ({ selectedType }: { selectedType: SourcesCardTypes }) => {
  const { selectedIds, deselectAll } = useDataSourceTableStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const isArtifactsPage = selectedType === SourcesCardTypes.VIDEOS || selectedType === SourcesCardTypes.SLIDES;
  const areSelectedItems = selectedIds.length > 0;

  if (!areSelectedItems) return null;

  // Common function to handle bulk deletion for documents and artifacts
  const handleBulkDeletion = async (
    response: DeleteArtifactsResponse | DeleteDocumentsResponse,
    itemType: 'documents' | 'artifacts',
  ) => {
    if (response) {
      const { total_processed, total_deleted, total_failed } = response;

      if (total_failed > 0) {
        toast.error(`Failed to delete ${total_failed} out of ${total_processed} ${itemType}.`);
      }

      if (total_deleted > 0) {
        // Invalidate and refetch the data
        await queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
        toast.success(`Successfully deleted ${total_deleted} out of ${total_processed} ${itemType}`);
      }
      // Clear selected items
      deselectAll();
    }
  };

  const deleteBulkItems = async () => {
    let response;
    if (selectedType === SourcesCardTypes.WEBPAGES) {
      response = await deleteWebpages({
        webpage_ids: selectedIds,
        delete_embeddings: true,
      });

      if (response?.data) {
        const data = response.data as unknown as DeleteWebpagesResponse;
        const { deactivated_count } = data;

        if (deactivated_count > 0) {
          // Invalidate and refetch the data
          await queryClient.invalidateQueries({ queryKey: ['data-source-table'] });
          // Clear selected items
          deselectAll();
          toast.success(`Successfully deleted ${deactivated_count} out of ${selectedIds.length} pages`);
        }
      }
    } else if (selectedType === SourcesCardTypes.DOCUMENTS) {
      response = await deleteDocuments({ document_ids: selectedIds });
      await handleBulkDeletion(response?.data, 'documents');
    } else if (isArtifactsPage) {
      response = await deleteArtifacts({ artifact_ids: selectedIds });
      await handleBulkDeletion(response?.data, 'artifacts');
    }
  };

  const handleBulkDelete = async () => {
    if (!areSelectedItems) return;

    try {
      setIsDeleting(true);
      await deleteBulkItems();
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Failed to delete selected items');
      setIsDialogOpen(false);
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  const getTriggerButton = () => {
    return (
      <Button onClick={() => setIsDialogOpen(true)} variant={'destructive_secondary'} buttonStyle={'icon'}>
        {isDialogOpen ? (
          <span className="animate-spin">⌛</span>
        ) : (
          <DeleteIcon width="16" height="16" className="text-destructive-1000" />
        )}
      </Button>
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{getTriggerButton()}</DialogTrigger>
      <DialogContent className="data-sources-dialog-shadow flex max-w-md flex-col items-center justify-center gap-14 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col items-center justify-center gap-1 self-stretch">
          <Typography variant={'title-24'} textColor={'textPrimary'} align={'center'}>
            Delete selected pages?
          </Typography>
          <Typography variant={'body-16'} textColor={'textSecondary'} align={'center'}>
            You're about to permanently remove the selected pages from your data source. This action cannot be undone.
          </Typography>
        </div>
        <div className="flex w-full items-center gap-6">
          <Button
            onClick={() => setIsDialogOpen(false)}
            variant="system_secondary"
            disabled={isDeleting}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkDelete}
            variant="destructive"
            buttonStyle={'rightIcon'}
            disabled={isDeleting}
            className="w-full"
          >
            Yes, Delete
            <DeleteIcon width="16" height="16" className="text-white" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBulkRowItemsButton;
