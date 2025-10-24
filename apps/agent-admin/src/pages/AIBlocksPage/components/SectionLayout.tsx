import React from 'react';

const SectionLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full items-center gap-8 self-stretch">{children}</div>;
};

export default SectionLayout;
