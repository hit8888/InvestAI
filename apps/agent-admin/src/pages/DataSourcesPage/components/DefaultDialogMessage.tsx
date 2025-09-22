import Typography from '@breakout/design-system/components/Typography/index';
import { useDataSources } from '../../../context/DataSourcesContext';
import DefaultInfoIcon from '@breakout/design-system/components/icons/sources-default-info-icon';
import { DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT, SourcesCardTypes } from '../constants';
import DragDropClickUploadFiles from './DragDropClickUploadFiles';
const { WEBPAGES, DOCUMENTS, VIDEOS, SLIDES } = SourcesCardTypes;

const DefaultDialogMessage = () => {
  const { selectedType } = useDataSources();

  const getDefaultMessageContent = () => {
    switch (selectedType) {
      case WEBPAGES:
        return <WebpagesDefaultMessage />;
      case DOCUMENTS:
      case VIDEOS:
      case SLIDES:
        return <DragDropClickUploadFiles />;
    }
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">{getDefaultMessageContent()}</div>
  );
};

const WebpagesDefaultMessage = () => {
  const { selectedType } = useDataSources();
  const message =
    DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT[selectedType as keyof typeof DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT];
  return (
    <div className="flex max-w-md flex-col items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 p-2.5">
        <DefaultInfoIcon className="text-gray-400" width="16" height="16" />
      </div>
      <Typography variant={'body-16'} align={'center'} textColor={'gray500'}>
        {message}
      </Typography>
    </div>
  );
};

export default DefaultDialogMessage;
