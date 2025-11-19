import withPageViewWrapper from '../PageViewWrapper';

/**
 * ConfigPage
 * Configuration page - Coming soon
 */
const ConfigPageBase = () => {
  return (
    <div className="flex h-full w-full flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Config</h1>
        <p className="text-sm text-gray-500">Configuration settings - Coming soon</p>
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Coming Soon</p>
          <p className="mt-2 text-sm text-gray-500">This page is under development</p>
        </div>
      </div>
    </div>
  );
};

const ConfigPage = withPageViewWrapper(ConfigPageBase);

export default ConfigPage;
