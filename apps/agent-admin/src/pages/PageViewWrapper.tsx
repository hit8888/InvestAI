// Define the HOC
const withPageViewWrapper = <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const ComponentWithWrapper: React.FC<P> = (props) => {
    return (
      <div className="flex w-full flex-shrink-0 flex-col items-start gap-8 bg-white p-4">
        <WrappedComponent {...props} />
      </div>
    );
  };

  return ComponentWithWrapper;
};

export default withPageViewWrapper;
