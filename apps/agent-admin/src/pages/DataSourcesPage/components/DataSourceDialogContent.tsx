import { useEffect, useState } from 'react';
import Button from '@breakout/design-system/components/Button/index';
import SourcesFetchIcon from '@breakout/design-system/components/icons/sources-fetch-icon';
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
import Typography from '@breakout/design-system/components/Typography/index';
import { DataSourceItem } from '@neuraltrade/core/types/admin/api';

// URL validation utility
const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return false;

  try {
    const urlObj = new URL(url);

    // Check if protocol is http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Strict hostname validation
    const hostnameParts = urlObj.hostname.split('.');

    // Must have at least 2 parts (domain + TLD), e.g., example.com
    if (hostnameParts.length < 2) {
      return false;
    }

    // TLD (last part) must be 2-6 characters and only letters (covers 99% of real TLDs)
    const tld = hostnameParts[hostnameParts.length - 1];
    if (tld.length < 2 || tld.length > 6) {
      return false;
    }

    // TLD should only contain letters (no numbers or hyphens)
    if (!/^[a-zA-Z]+$/.test(tld)) {
      return false;
    }

    // For better validation, require at least 3 parts if there's a subdomain (e.g., www.example.com)
    // This catches incomplete URLs like "www.hacker" or "www.hackerear"
    if (hostnameParts.length === 2) {
      const firstPart = hostnameParts[0];
      // If first part looks like a common subdomain (www, app, api, etc.), suggest adding more parts
      if (['www', 'app', 'api', 'web', 'mail', 'dev', 'staging'].includes(firstPart.toLowerCase())) {
        return false;
      }
    }

    // All parts must be non-empty and valid (contain alphanumeric chars)
    const invalidPart = hostnameParts.some((part) => {
      return part.length === 0 || !/^[a-zA-Z0-9-]+$/.test(part);
    });

    if (invalidPart) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const getUrlErrorMessage = (url: string): string | undefined => {
  if (!url.trim()) return undefined;

  if (!isValidUrl(url)) {
    return 'This doesn’t look like a valid link. Please check the URL and try again.';
  }

  return undefined;
};

// Separate component for webpage URL input functionality
type WebpageUrlInputProps = {
  urlLink: string;
  setUrlLink: (url: string) => void;
  isFetching: boolean;
  isFetched: boolean;
  fetchProgress: number;
  fetchWebpage: (url: string) => void;
  resetFetch: () => void;
  dataSources: DataSourceItem[];
};

const WebpageUrlInput = ({
  urlLink,
  setUrlLink,
  isFetching,
  isFetched,
  fetchProgress,
  fetchWebpage,
  resetFetch,
  dataSources,
}: WebpageUrlInputProps) => {
  const [urlError, setUrlError] = useState<string | undefined>(undefined);
  const [touched, setTouched] = useState(false);

  const handleUrlLinkInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUrlLink(newValue);

    // Clear error when user starts typing
    if (touched) {
      setUrlError(getUrlErrorMessage(newValue));
    }

    if (isFetched) {
      resetFetch();
    }
  };

  const handleInputBlur = () => {
    setTouched(true);
    setUrlError(getUrlErrorMessage(urlLink));
  };

  const handleInputFocus = () => {
    // Clear error on focus if the field is empty
    if (!urlLink.trim()) {
      setUrlError(undefined);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    const error = getUrlErrorMessage(urlLink);
    setTouched(true);
    setUrlError(error);

    if (!error && !isFetchButtonDisabled) {
      fetchWebpage(urlLink);
    }
  };

  const isFetchButtonDisabled =
    !urlLink.length || !!urlError || !isValidUrl(urlLink) || isFetching || (isFetched && !!dataSources.length);

  const showLoadingMessage = isFetching && !dataSources.length;
  const loadingMessage = DIALOG_LOADING_MESSAGE_MAPPED_OBJECT['webpages'];

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn('flex w-full flex-col items-start gap-3 self-stretch', {
        'items-center': showLoadingMessage,
      })}
    >
      {showLoadingMessage ? (
        <LoadingDialogMessage message={loadingMessage} progress={fetchProgress} />
      ) : (
        <>
          <Typography variant="caption-12-medium">Paste a page URL</Typography>
          <URLLinkInput
            placeholder="e.g. https://yourdomain.com/product-tour"
            inputValue={urlLink}
            onInputChange={handleUrlLinkInputValue}
            onInputBlur={handleInputBlur}
            onInputFocus={handleInputFocus}
            error={urlError}
          />
        </>
      )}
      {isFetched && !!dataSources.length ? null : (
        <div className="flex w-full justify-end">
          <Button type="submit" disabled={isFetchButtonDisabled} variant={'system'} buttonStyle={'rightIcon'}>
            {isFetching ? 'Fetching...' : 'Fetch'}
            {!isFetching ? <SourcesFetchIcon width="16" height="16" /> : <SpinLoader width={4} height={4} />}
          </Button>
        </div>
      )}
    </form>
  );
};

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

  const isWebpageDialog = selectedType === SourcesCardTypes.WEBPAGES;
  const isVideoDialog = selectedType === SourcesCardTypes.VIDEOS;
  const showDefaultMessage = !isFetching && !dataSources.length;
  const showFetchedData = !isFetching && dataSources.length;

  const isAddButtonDisabled = !dataSources.length;
  const showPattern = !isWebpageDialog && !isUploading && !dataSources.length;
  const showVideoLinkProvider = showDefaultMessage && !isUploading && isVideoDialog;

  return (
    <div className="flex w-full flex-col gap-6">
      {isWebpageDialog && (
        <WebpageUrlInput
          urlLink={urlLink}
          setUrlLink={setUrlLink}
          isFetching={isFetching}
          isFetched={isFetched}
          fetchProgress={fetchProgress}
          fetchWebpage={fetchWebpage}
          resetFetch={resetFetch}
          dataSources={dataSources}
        />
      )}
      <div
        className={cn('flex min-h-8 w-full items-center justify-center rounded-2xl', {
          'border border-gray-200 bg-gray-25': isUploading || dataSources.length,
          'relative border-2 border-dashed border-primary/60 bg-white': showPattern,
          'min-h-0': isWebpageDialog,
        })}
      >
        {showPattern && <SourcesDragDropPattern />}
        {showDefaultMessage ? <DefaultDialogMessage /> : null}
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
