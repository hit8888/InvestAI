import Typography from '@breakout/design-system/components/Typography/index';
import ExampleInfoIcon from '@breakout/design-system/components/icons/example-info-icon';
import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';
import { ComponentType, SVGProps, useLayoutEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface InfoCardProps {
  title: string;
  description: string;
  className?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
}

const MAX_COLLAPSED_LINES = 3;

const InfoCard = ({ title, description, className = '', icon }: InfoCardProps) => {
  const IconComponent = icon || ExampleInfoIcon;
  const classname = icon ? 'text-gray-500' : '';
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);
  const measurementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const measurementElement = measurementRef.current;
    let requiresToggle = false;

    if (measurementElement) {
      const computedStyle = window.getComputedStyle(measurementElement);
      const lineHeight = parseFloat(computedStyle.lineHeight || '0');

      if (lineHeight > 0) {
        const threshold = lineHeight * MAX_COLLAPSED_LINES;
        requiresToggle = measurementElement.scrollHeight - threshold > 1;
      }
    }

    setShouldShowToggle(requiresToggle);
    if (!requiresToggle) {
      setIsExpanded(false);
    }
  }, [description]);

  return (
    <div
      className={`relative flex w-full  flex-row items-center justify-center gap-4 rounded-lg border border-gray-200  bg-gray-100 p-2 ${className}`}
    >
      <IconComponent width="16px" height="16px" className={classname} />
      <div className="flex w-full flex-col items-start justify-center gap-0.5">
        <Typography className="capitalize" variant="caption-12-medium">
          {title}
        </Typography>
        <div className="flex w-full flex-col gap-1">
          <div className={`text-xs text-gray-500 ${shouldShowToggle && !isExpanded ? 'line-clamp-3' : ''}`}>
            <GithubMarkdownRenderer markdown={description} />
          </div>
          <div className="flex w-full justify-end">
            {shouldShowToggle && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="flex items-center justify-center gap-1 text-left text-[12px] text-blue_sec-1000"
              >
                {isExpanded ? 'Show less' : 'Show more'}
                <span className="pt-1 text-blue_sec-1000">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>
            )}
          </div>
        </div>

        <div
          ref={measurementRef}
          className="pointer-events-none absolute left-0 top-0 -z-10 w-full opacity-0"
          aria-hidden
        >
          <Typography variant="caption-12-normal" textColor="gray500">
            <GithubMarkdownRenderer markdown={description} />
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
