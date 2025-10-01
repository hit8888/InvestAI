import { useState } from 'react';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import { SourcesCardTypes } from '../constants';
import { useQueryClient } from '@tanstack/react-query';
import { deleteArtifacts, deleteDocuments, deleteWebpages } from '@meaku/core/adminHttp/api';
import { toast } from 'react-hot-toast';
import Button from '@breakout/design-system/components/Button/index';
import DeleteIcon from '@breakout/design-system/components/icons/delete-icon';
import { DeleteArtifactsResponse, DeleteDocumentsResponse, DeleteWebpagesResponse } from '@meaku/core/types/admin/api';
import DeleteDialogWrapper from '@breakout/design-system/components/layout/DeleteDialogWrapper';

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
    <DeleteDialogWrapper
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      getTriggerButton={getTriggerButton}
      handleDelete={handleBulkDelete}
      isDeleting={isDeleting}
    />
  );
};

export default DeleteBulkRowItemsButton;
