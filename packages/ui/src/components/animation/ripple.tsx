const Ripple = () => {
  return (
    <div className="ui-absolute ui-right-[2px] ui-top-0 ui-rounded-full ui-bg-primary-foreground ui-p-[2px]">
      <div className="ui-relative ui-z-10 ui-h-2 ui-w-2 ui-rounded-full ui-bg-success-600" />
      <div className="ui-absolute ui-left-[2px] ui-top-[2px] ui-z-0 ui-h-2 ui-w-2 ui-animate-ripple ui-rounded-full ui-bg-green-200" />
    </div>
  );
};

export default Ripple;
