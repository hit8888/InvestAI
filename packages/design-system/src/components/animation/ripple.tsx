const Ripple = () => {
  return (
    <div className="absolute right-[2px] top-0 rounded-full bg-primary-foreground p-[2px]">
      <div className="relative z-10 h-2 w-2 rounded-full bg-success-600" />
      <div className="absolute left-[2px] top-[2px] z-0 h-2 w-2 animate-ripple rounded-full bg-green-200" />
    </div>
  );
};

export default Ripple;
