import { cn } from '../../lib/cn';

interface IProps {
  text: string;
  className?: string;
}

const SlideSubTitle = ({ text, className }: IProps) => {
  return (
    <div className={cn('flex h-full w-1/2 items-center', className)}>
      <div className="flex gap-8">
        <div className="w-4 rounded-lg bg-secondary" />
        <h2 className="border-secondary text-6xl font-bold leading-snug text-customPrimaryText">{text}</h2>
      </div>
    </div>
  );
};

export default SlideSubTitle;
