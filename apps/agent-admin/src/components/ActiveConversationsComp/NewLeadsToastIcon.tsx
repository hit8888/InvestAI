import { Info } from 'lucide-react';

const NewLeadsToastIcon = () => {
  return (
    <div className="relative flex h-8 w-8 items-center justify-center">
      {/* Outer circle */}
      <div className="toast-icon-outer-circle" />
      {/* Inner circle */}
      <div className="toast-icon-inner-circle" />
      {/* Info icon */}
      <Info width={'16'} height={'16'} className="relative z-10 text-primary" />
    </div>
  );
};

export default NewLeadsToastIcon;
