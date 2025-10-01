import { VideoLibraryIcon } from '@meaku/saral';

export const DemoLibraryEmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <VideoLibraryIcon className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Demos Available</h3>
      <p className="text-gray-600 max-w-md">
        There are no interactive demos available at the moment. Please check back later or contact support for more
        information.
      </p>
    </div>
  );
};
