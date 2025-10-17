import withPageViewWrapper from '../PageViewWrapper';

/**
 * IcpV2BasePage
 * V2 implementation of the ICP (Ideal Customer Profile) page with new table design
 * TODO: Implement V2 table and layout
 */
const IcpV2BasePage = () => {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ICP V2</h1>
        <p className="text-sm text-gray-500">New table implementation - Coming soon</p>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">ICP V2 Table</p>
          <p className="mt-2 text-sm text-gray-500">This will contain the new table implementation</p>
        </div>
      </div>
    </div>
  );
};

const IcpV2Page = withPageViewWrapper(IcpV2BasePage);
export default IcpV2Page;
