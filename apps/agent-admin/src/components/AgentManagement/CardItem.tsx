import { ReactNode } from 'react';

const CardItem = ({ children }: { children?: ReactNode }) => {
  return <div className="flex w-full items-center gap-8 self-stretch">{children}</div>;
};

export default CardItem;
