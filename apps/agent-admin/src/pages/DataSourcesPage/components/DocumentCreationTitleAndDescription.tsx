import Input from '@breakout/design-system/components/layout/input';
import TextArea from '@breakout/design-system/components/TextArea/index';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { cn } from '@breakout/design-system/lib/cn';
import { Controller, Control } from 'react-hook-form';

type FormData = {
  title: string;
  data: string;
  relevant_queries: string[];
};

type DocumentCreationTitleAndDescriptionProps = {
  title: string;
  control: Control<FormData>;
  isSelected: boolean;
};

const DocumentCreationTitleAndDescription = ({
  title,
  control,
  isSelected,
}: DocumentCreationTitleAndDescriptionProps) => {
  return (
    <div className="-ml-4 -mt-4 h-full min-h-[66vh] w-[calc(100%+32px)] self-stretch bg-gray-100 p-4">
      <div className="flex h-full flex-col gap-4 self-stretch bg-white px-11 py-8">
        <TooltipWrapperDark
          showTooltip={isSelected && title.length > 0}
          trigger={
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter Title"
                  className="h-full w-full break-words border-none text-[54px] font-semibold leading-[1.2] focus-visible:ring-0"
                />
              )}
            />
          }
          content={title}
          tooltipAlign="center"
          showArrow={false}
        />
        <Controller
          name="data"
          control={control}
          render={({ field }) => (
            <TextArea
              {...field}
              placeholder="Write your document text…"
              className={cn('h-full w-full border-none text-base text-black focus-visible:ring-0')}
            />
          )}
        />
      </div>
    </div>
  );
};

export default DocumentCreationTitleAndDescription;
