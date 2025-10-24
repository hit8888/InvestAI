import { useDataSources } from '../../../context/DataSourcesContext';
import {
  DATA_SOURCES_ACCEPTED_FILE_TYPES,
  DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT,
  DIALOG_LOADING_MESSAGE_MAPPED_OBJECT,
  FILE_TYPES_NOT_ACCEPTED_ERROR_TOAST_MESSAGE,
  SourcesCardTypes,
} from '../constants';
import DragDropClickUploadFiles from './DragDropClickUploadFiles';
const { WEBPAGES, DOCUMENTS, VIDEOS, SLIDES } = SourcesCardTypes;

const DefaultDialogMessage = () => {
  const { selectedType } = useDataSources();
  const acceptedFiles = DATA_SOURCES_ACCEPTED_FILE_TYPES[selectedType as keyof typeof DATA_SOURCES_ACCEPTED_FILE_TYPES];
  const errorMessage =
    FILE_TYPES_NOT_ACCEPTED_ERROR_TOAST_MESSAGE[
      selectedType as keyof typeof FILE_TYPES_NOT_ACCEPTED_ERROR_TOAST_MESSAGE
    ];
  const defaultMessage =
    DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT[selectedType as keyof typeof DIALOG_DEFAULT_MESSAGE_MAPPED_OBJECT];
  const loadingDialogMessage =
    DIALOG_LOADING_MESSAGE_MAPPED_OBJECT[selectedType as keyof typeof DIALOG_LOADING_MESSAGE_MAPPED_OBJECT];

  const getDefaultMessageContent = () => {
    switch (selectedType) {
      case WEBPAGES:
        return null;
      case DOCUMENTS:
      case VIDEOS:
      case SLIDES:
        return (
          <DragDropClickUploadFiles
            loadingDialogMessage={loadingDialogMessage}
            acceptedFiles={acceptedFiles}
            errorMessage={errorMessage}
            defaultMessage={defaultMessage}
            showContentAtCenter={false}
          />
        );
    }
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">{getDefaultMessageContent()}</div>
  );
};

export default DefaultDialogMessage;
