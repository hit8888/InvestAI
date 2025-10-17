import AgentConfigHeader from './AgentConfigHeader.tsx';
import Shimmer from './Shimmer.tsx';

type DataSourceLoadingStateProps = {
  heading: string;
  subHeading: string;
};

const DataSourceLoadingState = ({ heading, subHeading }: DataSourceLoadingStateProps) => {
  return (
    <div className="flex w-full flex-shrink-0 flex-col items-start gap-4 bg-white p-6">
      <div className="flex-start flex w-full flex-col gap-11 self-stretch">
        <AgentConfigHeader headerLabel={heading} subHeading={subHeading} />
        <div className="flex max-w-2xl flex-col gap-12 self-stretch">
          <Shimmer />
        </div>
      </div>
    </div>
  );
};

export default DataSourceLoadingState;
