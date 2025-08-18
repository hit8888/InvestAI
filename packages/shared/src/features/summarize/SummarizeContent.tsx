import { FeatureHeader } from '../../components/FeatureHeader';
import type { FeatureContentProps } from '../';
import { Icons } from '@meaku/saral';

const SummarizeContent = ({ onClose, onExpand, isExpanded }: FeatureContentProps) => {
  return (
    <div className="h-[680px] w-full space-y-4 rounded-lg border bg-muted shadow-lg">
      <FeatureHeader
        title="Summarize"
        icon={<Icons.Wand className="h-4 w-4" />}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={isExpanded}
        ctas={[]}
      />
    </div>
  );
};

export default SummarizeContent;
