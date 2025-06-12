import Input from '@breakout/design-system/components/layout/input';
import TextArea from '@breakout/design-system/components/TextArea/index';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { cn } from '@breakout/design-system/lib/cn';

type DocumentCreationTitleAndDescriptionProps = {
  title: string;
  description: string;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  isSelected: boolean;
};

const DocumentCreationTitleAndDescription = ({
  title,
  description,
  setTitle,
  setDescription,
  isSelected,
}: DocumentCreationTitleAndDescriptionProps) => {
  return (
    <div className="w-full self-stretch bg-gray-100 p-4">
      <div className="flex h-full flex-col gap-4 self-stretch bg-white px-11 py-8">
        <TooltipWrapperDark
          showTooltip={isSelected}
          trigger={
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="h-full w-full break-words border-none text-[54px] font-semibold leading-[1.2] focus-visible:ring-0"
            />
          }
          content={title}
          tooltipAlign="center"
          showArrow={false}
        />
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write your document text…"
          className={cn(
            'min-h-[calc(70vh-100px)] w-full border-none text-base text-black focus-visible:ring-0',
            isSelected && 'min-h-[400px]',
          )}
        />
      </div>
    </div>
  );
};

export default DocumentCreationTitleAndDescription;
