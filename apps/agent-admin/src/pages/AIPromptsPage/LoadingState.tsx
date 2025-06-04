import AgentConfigHeader from '../../components/AgentManagement/AgentConfigHeader';
import Shimmer from '../../components/AgentManagement/Shimmer';

type LoadingStateProps = {
  title: string;
  description: string;
};

const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className="flex-start flex w-full flex-col gap-11 self-stretch">
      <AgentConfigHeader
        headerLabel={title}
        subHeading={description}
        headerVariant={'title-18'}
        subHeadingVariant={'body-14'}
      />
      <div className="flex max-w-2xl flex-col gap-12 self-stretch">
        <Shimmer type={'ai-prompts'} />
      </div>
    </div>
  );
};

export default LoadingState;
