import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@breakout/design-system/lib/cn';
import Typography from '@breakout/design-system/components/Typography/index';

export interface EnrichedDataField {
  id: string;
  label: string;
}

export interface FormEnrichedDataSectionProps {
  /** Array of enriched data fields to display */
  fields: EnrichedDataField[];
  /** Number of rows to show when collapsed (default: 1) */
  collapsedRows?: number;
  /** Custom class name for the container */
  className?: string;
  /** Title for the section */
  title?: string;
  /** Description text */
  description?: string;
}

interface UseDynamicChipRowsResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  rowContainerRefs: React.RefObject<Map<number, HTMLDivElement>>;
  visibleChips: EnrichedDataField[];
  hasMoreChips: boolean;
  measureChipWidth: (field: EnrichedDataField) => void;
}

// Custom hook for dynamic chip width calculations across multiple rows
const useDynamicChipRows = (
  fields: EnrichedDataField[],
  collapsedRows: number,
  isExpanded: boolean,
): UseDynamicChipRowsResult => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rowContainerRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [chipWidths, setChipWidths] = useState<Map<string, number>>(new Map());
  const [visibleChips, setVisibleChips] = useState<EnrichedDataField[]>([]);
  const [hasMoreChips, setHasMoreChips] = useState(false);

  const measureChipWidth = useCallback(
    (field: EnrichedDataField) => {
      // Skip if already measured
      if (chipWidths.has(field.id)) {
        return;
      }

      // Create a temporary element to measure chip width
      const tempElement = document.createElement('span');
      tempElement.className =
        'inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-sm font-medium text-gray-700 border border-gray-200 absolute -left-[9999px] top-0 whitespace-nowrap';
      tempElement.textContent = field.label;

      document.body.appendChild(tempElement);
      const width = tempElement.offsetWidth;
      document.body.removeChild(tempElement);

      setChipWidths((prev) => new Map(prev).set(field.id, width));
    },
    [chipWidths],
  );

  const measureShowMoreButtonWidth = useCallback(() => {
    const tempElement = document.createElement('button');
    tempElement.className =
      'flex items-center gap-1 text-sm font-medium text-blue-600 absolute -left-[9999px] top-0 whitespace-nowrap';
    tempElement.innerHTML = `
        Show More
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      `;

    document.body.appendChild(tempElement);
    const width = tempElement.offsetWidth;
    document.body.removeChild(tempElement);

    return width;
  }, []);

  const calculateVisibleChips = useCallback(() => {
    if (isExpanded) {
      setVisibleChips(fields);
      setHasMoreChips(false);
      return;
    }

    if (!containerRef.current || fields.length === 0) {
      setVisibleChips(fields);
      setHasMoreChips(false);
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    if (containerWidth === 0) return; // Container not ready yet

    const gap = 8; // gap-2 = 8px

    let currentRow = 0;
    let currentRowWidth = 0;
    let visibleCount = 0;
    let needsShowMore = false;

    // Calculate visible chips across rows
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const chipWidth = chipWidths.get(field.id);

      // If width not measured yet, skip this calculation cycle
      if (!chipWidth) {
        return;
      }

      const widthWithGap = currentRowWidth === 0 ? chipWidth : currentRowWidth + gap + chipWidth;

      // Check if this chip would fit in the current row
      if (widthWithGap <= containerWidth) {
        // Chip fits in current row
        currentRowWidth = widthWithGap;
        visibleCount++;
      } else {
        // Chip doesn't fit, need to move to next row
        currentRow++;

        // Check if we've reached the collapsed row limit
        if (currentRow >= collapsedRows) {
          // We're at or beyond the collapsed row limit
          // Check if we need space for "Show More" button in the last row
          const remainingChips = fields.length - visibleCount;

          if (remainingChips > 0) {
            // There are more chips to show
            // Check if the Show More button would fit in the current (last visible) row
            // We need to recalculate the last row to potentially make space for Show More
            needsShowMore = true;
          }
          break;
        }

        // Start new row with this chip
        currentRowWidth = chipWidth;
        visibleCount++;
      }
    }

    // If we need to show the "Show More" button, we might need to remove the last chip
    // to make room for it in the last row
    if (needsShowMore) {
      const showMoreWidth = measureShowMoreButtonWidth();

      // Recalculate the last row to see if we need to remove chips for Show More button
      let lastRowStartIndex = 0;
      let tempRowWidth = 0;
      let tempRow = 0;

      for (let i = 0; i < visibleCount; i++) {
        const field = fields[i];
        const chipWidth = chipWidths.get(field.id) || 0;
        const widthWithGap = tempRowWidth === 0 ? chipWidth : tempRowWidth + gap + chipWidth;

        if (widthWithGap <= containerWidth) {
          tempRowWidth = widthWithGap;
        } else {
          tempRow++;
          tempRowWidth = chipWidth;
          if (tempRow === collapsedRows - 1) {
            lastRowStartIndex = i;
          }
        }
      }

      // Check if Show More button fits in the last row with all current chips
      const lastRowEndIndex = visibleCount;
      let lastRowWidth = 0;
      for (let i = lastRowStartIndex; i < lastRowEndIndex; i++) {
        const field = fields[i];
        const chipWidth = chipWidths.get(field.id) || 0;
        lastRowWidth = lastRowWidth === 0 ? chipWidth : lastRowWidth + gap + chipWidth;
      }

      // Check if Show More button would fit
      while (lastRowWidth + gap + showMoreWidth > containerWidth && visibleCount > 0) {
        visibleCount--;
        const removedField = fields[visibleCount];
        const removedWidth = chipWidths.get(removedField.id) || 0;
        lastRowWidth -= removedWidth + gap;
        if (lastRowWidth < 0) lastRowWidth = 0;
      }
    }

    setVisibleChips(fields.slice(0, visibleCount));
    setHasMoreChips(visibleCount < fields.length);
  }, [fields, chipWidths, collapsedRows, isExpanded, measureShowMoreButtonWidth]);

  // Reset visible chips and clean up widths when fields change
  useEffect(() => {
    setVisibleChips([]);
    setHasMoreChips(false);

    // Clean up chip widths for removed items
    const currentIds = new Set(fields.map((f) => f.id));
    setChipWidths((prev) => {
      const newMap = new Map();
      prev.forEach((width, id) => {
        if (currentIds.has(id)) {
          newMap.set(id, width);
        }
      });
      return newMap;
    });
  }, [fields]);

  useEffect(() => {
    calculateVisibleChips();
  }, [calculateVisibleChips]);

  useEffect(() => {
    const handleResize = () => calculateVisibleChips();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateVisibleChips]);

  return {
    containerRef,
    rowContainerRefs,
    visibleChips,
    hasMoreChips,
    measureChipWidth,
  };
};

const FormEnrichedDataSection: React.FC<FormEnrichedDataSectionProps> = ({
  fields,
  collapsedRows = 1,
  className,
  title = 'Enriched Data',
  description = 'Automatically enrich the following fields without making your forms longer.',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { containerRef, visibleChips, measureChipWidth } = useDynamicChipRows(fields, collapsedRows, isExpanded);

  // Measure all chip widths when fields change
  useEffect(() => {
    fields.forEach((field) => {
      measureChipWidth(field);
    });
  }, [fields, measureChipWidth]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const displayFields = isExpanded ? fields : visibleChips;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Header Section */}
      <div className="space-y-2">
        <Typography variant="label-16-medium">{title}</Typography>
        <Typography variant="body-14" textColor="gray500">
          {description}
        </Typography>
      </div>

      {/* Chips Grid */}
      <div className="w-full space-y-3">
        <div ref={containerRef} className="flex flex-wrap gap-2">
          {displayFields.map((field) => (
            <Chip key={field.id} label={field.label} />
          ))}
        </div>

        {/* Toggle Button */}
        <div className="flex justify-start">
          <button onClick={handleToggle} className="flex items-center gap-1 text-sm font-medium text-primary">
            {isExpanded ? (
              <>
                Show Less
                <ChevronUp className="h-4 w-4 text-primary" />
              </>
            ) : (
              <>
                Show More
                <ChevronDown className="h-4 w-4 text-primary" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ChipProps {
  label: string;
}

const Chip: React.FC<ChipProps> = ({ label }) => {
  return <div className="inline-block rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-600">{label}</div>;
};

export default FormEnrichedDataSection;
