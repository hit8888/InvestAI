import Typography from '@breakout/design-system/components/Typography/index';
import { ReactNode } from 'react';

const Section = ({ heading, children }: { heading: string; children: ReactNode }) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <Typography variant="title-18">{heading}</Typography>
      {children}
    </div>
  );
};

export default Section;
