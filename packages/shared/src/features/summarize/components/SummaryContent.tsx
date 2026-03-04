import { LucideIcon, Typography } from '@neuraltrade/saral';
import { TextArtifact } from '../../ask-ai/Messages/TextArtifact';
import { ThumbsUp } from '@neuraltrade/saral';
import { ConfettiAnimation } from '../../../components/ConfettiAnimation';
import { useState, useEffect, useMemo } from 'react';
import useFeatureConfig from '../../../hooks/useFeatureConfig';
import { CommandBarModuleTypeSchema } from '@neuraltrade/core/types/api/configuration_response';

interface SummarySuccessProps {
  content: string;
  isSummarizing: boolean;
}

export const SummaryContent = ({ content, isSummarizing }: SummarySuccessProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.SUMMARIZE);
  const banner = featureConfig?.banner?.public_url;

  useEffect(() => {
    // Check if confetti has already been played for this summary session
    const confettiKey = `confetti-played-${content.slice(0, 50)}`; // Use first 50 chars as unique key
    const hasPlayedConfetti = sessionStorage.getItem(confettiKey);

    if (!hasPlayedConfetti && content.length > 0) {
      // Only trigger confetti animation once per unique summary
      setShowConfetti(true);
      sessionStorage.setItem(confettiKey, 'true');
    }
  }, [content]);

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  return (
    <>
      <ConfettiAnimation isActive={showConfetti} onComplete={handleConfettiComplete} />
      {isSummarizing ? <SummaryProcessingBanner banner={banner} /> : <SummarySuccessBanner />}
      <div className="text-gray-600 text-sm flex-1 overflow-y-auto">
        {isSummarizing ? <TextArtifactShimmer /> : <TextArtifact content={content} />}
      </div>
    </>
  );
};

const SummaryProcessingBanner = ({ banner }: { banner: string | undefined }) => {
  if (!banner) return null;
  return (
    <div className="flex w-full h-[100px] rounded-xl">
      <img src={banner} alt="banner" className="w-full h-full" />
    </div>
  );
};

const SummarySuccessBanner = () => {
  const savedMinutes = useMemo(() => Math.floor(Math.random() * (20 - 15 + 1)) + 15, []); // Random number between 15-20
  return (
    <div className="flex flex-col gap-3 bg-backgroundSubtle rounded-xl p-2.5">
      <Typography variant="body-small" fontWeight="semibold" className="text-textAccent">
        You just saved
        <span className="pl-1 inline text-xs text-positive-dark font-bold">{savedMinutes} mins!</span>
      </Typography>
      <Typography
        variant="body"
        fontWeight="medium"
        className="flex relative items-center gap-2 text-textAccent bg-white px-3 py-2 rounded-xl"
      >
        <ThumbsUp className="absolute right-[10%] bottom-7" />
        <LucideIcon name="check" className="size-4 bg-positive-dark rounded-full p-1 text-white" />
        Summary Complete
      </Typography>
    </div>
  );
};

const TextArtifactShimmer = () => {
  return (
    <div className="flex flex-col gap-3 rounded-xl p-2.5">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="w-full animate-pulse bg-backgroundSubtle rounded-xl h-16" />
      ))}
    </div>
  );
};
