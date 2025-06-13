import Button from '@breakout/design-system/components/Button/index';
import { useDataSources } from '../../../context/DataSourcesContext';
import { SourcesCardTypes, SOURCES_DIALOG_DESCRIPTION_MAPPED_OBJECT } from '../constants';
import AddMorePlusIcon from '@breakout/design-system/components/icons/sources-add-more-plus-icon';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@breakout/design-system/components/layout/dialog';
import { useState } from 'react';
import Typography from '@breakout/design-system/components/Typography/index';
import DataSourceDialogContent from './DataSourceDialogContent';

const { WEBPAGES, DOCUMENTS, VIDEOS, SLIDES } = SourcesCardTypes;

const CommonUploadDataSourcesButton = () => {
  const { selectedType } = useDataSources();
  const [openDialog, setOpenDialog] = useState(false);

  const sourceLabel = (() => {
    switch (selectedType) {
      case WEBPAGES:
        return 'Webpages';
      case DOCUMENTS:
        return 'Documents';
      case VIDEOS:
        return 'Videos';
      case SLIDES:
        return 'Slides';
      default:
        return '';
    }
  })();

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={'primary'} buttonStyle={'rightIcon'}>
          Upload {sourceLabel}
          <AddMorePlusIcon width="16" height="16" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="data-sources-dialog-shadow w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-4"
      >
        <DialogHeader className="flex w-full items-start gap-2 text-start">
          <DialogTitle>
            <Typography variant={'title-24'} className="text-customPrimaryText">{`Add New ${sourceLabel}`}</Typography>
          </DialogTitle>
          {selectedType ? (
            <Typography variant={'body-16'} className="text-customSecondaryText">
              {
                SOURCES_DIALOG_DESCRIPTION_MAPPED_OBJECT[
                  selectedType as keyof typeof SOURCES_DIALOG_DESCRIPTION_MAPPED_OBJECT
                ]
              }
            </Typography>
          ) : null}
        </DialogHeader>
        <DataSourceDialogContent onClose={handleDialogClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CommonUploadDataSourcesButton;
