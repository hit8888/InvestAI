import { motion } from 'framer-motion';
import { Button, Markdown } from '@meaku/saral';
import NudgeAsset from './NudgeAsset';
import NudgeTimeoutLoader from './NudgeTimeoutLoader';
import { Cta, Asset } from '@meaku/core/types/api/configuration_response';
import NudgeDismissButton from './NudgeDismissButton';

interface NudgeBodyProps {
  content: string;
  displayDuration?: number;
  headerPresent: boolean;
  topAssets: Asset[];
  bottomAssets: Asset[];
  ctas?: Cta[];
  onCtaClick: (button: Cta) => void;
  onDismiss: () => void;
}

const NudgeBody = ({
  content,
  displayDuration,
  headerPresent,
  topAssets,
  bottomAssets,
  ctas,
  onCtaClick,
  onDismiss,
}: NudgeBodyProps) => {
  return (
    <motion.div
      className="bg-background rounded-3xl shadow-elevation-md relative"
      layout="position"
      initial={{ opacity: 0, x: 20, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{
        duration: 1.0,
        ease: [0.175, 0.885, 0.32, 1.275],
        delay: headerPresent ? 0.25 : 0.35,
      }}
    >
      <motion.div
        className="flex flex-col gap-4 p-5 overflow-hidden rounded-3xl relative"
        initial={{ clipPath: 'inset(0 0 0 100% round 24px)' }}
        animate={{ clipPath: 'inset(0 0 0 0 round 24px)' }}
        transition={{ duration: 1.0, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        {displayDuration && displayDuration > 0 && !headerPresent && <NudgeTimeoutLoader duration={displayDuration} />}

        {topAssets.length > 0 && (
          <div className="grid gap-4">
            {topAssets.map((asset) => (
              <NudgeAsset key={asset.asset_url} asset={asset} />
            ))}
          </div>
        )}

        <div className="text-gray-600 text-sm/6">
          <Markdown markdown={content} />
        </div>

        {bottomAssets.length > 0 && (
          <div className="grid gap-4">
            {bottomAssets.map((asset) => (
              <NudgeAsset key={asset.asset_url} asset={asset} />
            ))}
          </div>
        )}

        {ctas && ctas.length > 0 && (
          <div className="flex flex-col gap-2">
            {ctas.map((button, index) => (
              <Button
                key={button.action}
                variant={index === 0 ? 'default' : 'outline'}
                className="w-full"
                onClick={() => onCtaClick(button)}
              >
                {button.text}
              </Button>
            ))}
          </div>
        )}
      </motion.div>
      {!headerPresent && <NudgeDismissButton onClick={onDismiss} />}
    </motion.div>
  );
};

export default NudgeBody;
