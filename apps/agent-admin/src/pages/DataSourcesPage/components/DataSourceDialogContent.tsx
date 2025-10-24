import { useEffect, useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import SourcesFetchIcon from '@breakout/design-system/components/icons/sources-fetch-icon';
import FilledTickDoneIcon from '@breakout/design-system/components/icons/filled-done-tick-icon';
import SourcesDragDropPattern from '@breakout/design-system/components/icons/sources-dragdrop-patterns';
import SpinLoader from '@breakout/design-system/components/layout/SpinLoader';
import CommonAddNewSourcesData from './CommonAddNewSourcesData';
import LoadingDialogMessage from './LoadingDialogMessage';
import DefaultDialogMessage from './DefaultDialogMessage';
import { cn } from '@breakout/design-system/lib/cn';
import { useDataSources } from '../../../context/DataSourcesContext';
import { DIALOG_LOADING_MESSAGE_MAPPED_OBJECT, SourcesCardTypes } from '../constants';
import { useDataSourcesStore } from '../../../stores/useDataSourcesStore';
import { useDataSourceAdd } from '../../../hooks/useDataSourceAdd';
import { useSitemapFetch } from '../../../hooks/useSitemapFetch';
import URLLinkInput from '@breakout/design-system/components/layout/URLLinkInput';
import VideoLinkProvider from './VideoLinkProvider';

type DataSourceDialogContentProps = {
  onClose: () => void;
};

const DataSourceDialogContent = ({ onClose }: DataSourceDialogContentProps) => {
  const [urlLink, setUrlLink] = useState('');
  const { selectedType, isUploading } = useDataSources();
  const { dataSources: allDataSources } = useDataSourcesStore();
  const { fetchProgress, isFetching, isFetched, fetchWebpage, resetFetch } = useSitemapFetch();

  const dataSources = allDataSources.filter((source) => !source.is_cancelled);

  // Reset the data sources when the component unmounts
  useEffect(() => {
    return () => {
      resetFetch();
    };
  }, []);

  const handleUrlLinkInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlLink(e.target.value);
    if (isFetched) {
      resetFetch();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFetchButtonDisabled) {
      fetchWebpage(urlLink);
    }
  };

  const getUrlLinkInputAndFetchButton = () => {
    if (!isWebpageDialog) return;

    return (
      <form onSubmit={handleFormSubmit} className="flex w-full items-center gap-6 self-stretch">
        <URLLinkInput inputValue={urlLink} onInputChange={handleUrlLinkInputValue} />
        <Button type="submit" disabled={isFetchButtonDisabled} variant={'system'} buttonStyle={'rightIcon'}>
          {isFetched && !!dataSources.length ? 'Done' : isFetching ? 'Fetching...' : 'Fetch'}
          {isFetched ? (
            <FilledTickDoneIcon width="16" height="16" />
          ) : !isFetching ? (
            <SourcesFetchIcon width="16" height="16" />
          ) : (
            <SpinLoader width={4} height={4} />
          )}
        </Button>
      </form>
    );
  };

  const isFetchButtonDisabled = !urlLink.length || isFetching || (isFetched && !!dataSources.length);
  const isWebpageDialog = selectedType === SourcesCardTypes.WEBPAGES;
  const isVideoDialog = selectedType === SourcesCardTypes.VIDEOS;
  const showDefaultMessage = !isFetching && !dataSources.length;
  const showLoadingMessageForSitemapFetch = isFetching && !dataSources.length && isWebpageDialog;
  const showFetchedData = !isFetching && dataSources.length;

  const isAddButtonDisabled = !dataSources.length;
  const showPattern = !isWebpageDialog && !isUploading && !dataSources.length;
  const showVideoLinkProvider = showDefaultMessage && !isUploading && isVideoDialog;

  const loadingMessageForSitemapFetch = DIALOG_LOADING_MESSAGE_MAPPED_OBJECT['webpages'];

  return (
    <div className="flex w-full flex-col gap-6">
      {getUrlLinkInputAndFetchButton()}
      <div
        className={cn('flex min-h-8 w-full items-center justify-center rounded-2xl', {
          'border border-gray-200 bg-gray-25': isUploading || isWebpageDialog || dataSources.length,
          'relative border-2 border-dashed border-primary/60 bg-white': showPattern,
        })}
      >
        {showPattern && <SourcesDragDropPattern />}
        {showDefaultMessage ? <DefaultDialogMessage /> : null}

        {showLoadingMessageForSitemapFetch ? (
          <LoadingDialogMessage message={loadingMessageForSitemapFetch} progress={fetchProgress} />
        ) : null}
        {showFetchedData ? <CommonAddNewSourcesData data={dataSources} onDeleteAll={resetFetch} /> : null}
      </div>
      {showVideoLinkProvider ? <VideoLinkProvider /> : null}
      {!isAddButtonDisabled && (
        <div className="flex w-full flex-1 items-end justify-end">
          <DataSourceDialogAddButton
            urlLink={urlLink}
            selectedType={selectedType}
            onClose={onClose}
            resetFetch={resetFetch}
          />
        </div>
      )}
    </div>
  );
};

type DataSourceAddButtonProps = {
  selectedType: string | null;
  urlLink?: string;
  onClose: () => void;
  resetFetch: () => void;
};

const DataSourceDialogAddButton = ({ selectedType, urlLink, onClose, resetFetch }: DataSourceAddButtonProps) => {
  const { isAdding, addDataSources } = useDataSourceAdd(selectedType, urlLink);

  const handleAddButtonClick = async () => {
    await addDataSources();
    resetFetch();
    onClose();
  };

  return (
    <Button onClick={handleAddButtonClick} disabled={isAdding} variant={'system'} buttonStyle={'rightIcon'}>
      {isAdding ? 'Embedding...' : 'Embed'}
      {isAdding && <SpinLoader width={4} height={4} />}
    </Button>
  );
};

export default DataSourceDialogContent;
