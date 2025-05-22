import { useEffect, useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import Input from '@breakout/design-system/components/layout/input';
import SourcesFetchIcon from '@breakout/design-system/components/icons/sources-fetch-icon';
import SourcesUrlLinkIcon from '@breakout/design-system/components/icons/sources-url-link-icon';
import FilledTickDoneIcon from '@breakout/design-system/components/icons/filled-done-tick-icon';
import SourcesDragDropPattern from '@breakout/design-system/components/icons/sources-dragdrop-patterns';
import SpinLoader from '@breakout/design-system/components/layout/SpinLoader';
import CommonAddNewSourcesData from './CommonAddNewSourcesData';
import LoadingDialogMessage from './LoadingDialogMessage';
import DefaultDialogMessage from './DefaultDialogMessage';
import { cn } from '@breakout/design-system/lib/cn';
import { useDataSources } from '../../../context/DataSourcesContext';
import { SourcesCardTypes } from '../constants';
import AddMorePlusIcon from '@breakout/design-system/components/icons/sources-add-more-plus-icon';
import { useDataSourcesStore } from '../../../stores/useDataSourcesStore';
import { useDataSourceAdd } from '../../../hooks/useDataSourceAdd';
import { useSitemapFetch } from '../../../hooks/useSitemapFetch';

type DataSourceDialogContentProps = {
  onClose: () => void;
};

const DataSourceDialogContent = ({ onClose }: DataSourceDialogContentProps) => {
  const [urlLink, setUrlLink] = useState('');
  const { selectedType, isUploading } = useDataSources();
  const { dataSources } = useDataSourcesStore();
  const { fetchProgress, isFetching, isFetched, fetchWebpage, resetFetch } = useSitemapFetch();

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

  const getUrlLinkInputAndFetchButton = () => {
    if (!isWebpageDialog) return;

    return (
      <div className="flex w-full items-center gap-6 self-stretch">
        <DataSourceURLLinkInput inputValue={urlLink} onInputChange={handleUrlLinkInputValue} />
        <Button
          disabled={isFetchButtonDisabled}
          onClick={() => fetchWebpage(urlLink)}
          variant={'system'}
          buttonStyle={'rightIcon'}
        >
          {isFetched && !!dataSources.length ? 'Done' : isFetching ? 'Fetching...' : 'Fetch'}
          {isFetched ? (
            <FilledTickDoneIcon width="16" height="16" />
          ) : !isFetching ? (
            <SourcesFetchIcon width="16" height="16" />
          ) : (
            <SpinLoader width={4} height={4} />
          )}
        </Button>
      </div>
    );
  };

  const isFetchButtonDisabled = !urlLink.length || isFetching || (isFetched && !!dataSources.length);
  const isWebpageDialog = selectedType === SourcesCardTypes.WEBPAGES;
  const showDefaultMessage = !isFetching && !dataSources.length;
  const showLoadingMessage = isFetching && !dataSources.length;
  const showFetchedData = !isFetching && dataSources.length;

  const isAddButtonDisabled = !dataSources.length;
  const showPattern = !isWebpageDialog && !isUploading && !dataSources.length;

  return (
    <div className="flex w-full flex-col gap-6">
      {getUrlLinkInputAndFetchButton()}
      <div
        className={cn('flex min-h-52 w-full items-center justify-center rounded-2xl', {
          'border border-gray-200 bg-gray-25': isUploading || isWebpageDialog || dataSources.length,
          'relative border-2 border-dashed border-primary/60 bg-white': showPattern,
        })}
      >
        {showPattern && <SourcesDragDropPattern />}
        {showDefaultMessage ? <DefaultDialogMessage /> : null}
        {showLoadingMessage ? <LoadingDialogMessage progress={fetchProgress} /> : null}
        {showFetchedData ? <CommonAddNewSourcesData data={dataSources} onDeleteAll={resetFetch} /> : null}
      </div>
      <div className="flex w-full flex-1 items-end justify-end">
        <DataSourceDialogAddButton
          urlLink={urlLink}
          selectedType={selectedType}
          isAddButtonDisabled={isAddButtonDisabled}
          onClose={onClose}
          resetFetch={resetFetch}
        />
      </div>
    </div>
  );
};

type DataSourceURLLinkInputProps = {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DataSourceURLLinkInput = ({ inputValue, onInputChange }: DataSourceURLLinkInputProps) => {
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3">
      <SourcesUrlLinkIcon width="16" height="16" className="text-blue_sec-1000" />
      <Input
        className="h-4 w-full flex-1 border-none p-0 text-blue_sec-1000 outline-none focus:ring-0"
        value={inputValue}
        onChange={onInputChange}
      />
    </div>
  );
};

type DataSourceAddButtonProps = {
  selectedType: string | null;
  isAddButtonDisabled: boolean;
  urlLink?: string;
  onClose: () => void;
  resetFetch: () => void;
};

const DataSourceDialogAddButton = ({
  selectedType,
  isAddButtonDisabled,
  urlLink,
  onClose,
  resetFetch,
}: DataSourceAddButtonProps) => {
  const { isAdding, addDataSources } = useDataSourceAdd(selectedType, urlLink);

  const handleAddButtonClick = async () => {
    await addDataSources();
    resetFetch();
    onClose();
  };

  return (
    <Button
      onClick={handleAddButtonClick}
      disabled={isAddButtonDisabled || isAdding}
      variant={'system'}
      buttonStyle={'rightIcon'}
    >
      {isAdding ? 'Adding...' : 'Add'}
      {!isAdding && <AddMorePlusIcon width="16" height="16" />}
      {isAdding && <SpinLoader width={4} height={4} />}
    </Button>
  );
};

export default DataSourceDialogContent;
