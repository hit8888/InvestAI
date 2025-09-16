import DataNotFoundWithSearchTermIcon from '../icons/data-not-found-with-search-term';

type NoDataFoundWithSearchTermProps = {
  searchTerm: string;
};

const NoDataFoundWithSearchTerm = ({ searchTerm }: NoDataFoundWithSearchTermProps) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <DataNotFoundWithSearchTermIcon width={200} height={200} />
      <div className="flex w-full flex-col items-center justify-center gap-2 p-10 text-base text-gray-500">
        <p>
          No results found for <span className="font-medium text-gray-900">"{searchTerm}"</span>
        </p>
        <p>Try adjusting your search terms</p>
      </div>
    </div>
  );
};

export default NoDataFoundWithSearchTerm;
