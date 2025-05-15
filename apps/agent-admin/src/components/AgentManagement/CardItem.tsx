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
      <div className={`flex w-full items-center gap-8 self-stretch ${className}`}>{children}</div>
      {separator && <CardItemBreak />}
    </>
  );
};

export default CardItem;
