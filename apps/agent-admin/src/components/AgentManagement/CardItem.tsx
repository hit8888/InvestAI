import { ReactNode } from 'react';
import CardItemBreak from './CardItemBreak.tsx';

const CardItem = ({
  children,
  separator = false,
  className,
}: {
  children?: ReactNode;
  separator?: boolean;
  className?: string;
}) => {
  return (
    <>
      <div className={`flex w-full items-center gap-x-8 gap-y-6 self-stretch ${className}`}>{children}</div>
      {separator && <CardItemBreak />}
    </>
  );
};

export default CardItem;
