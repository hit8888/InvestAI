import { Icons, Typography } from '@meaku/saral';
import { TextArtifact } from '../../../features/ask-ai/Messages/TextArtifact';
import { ThumbsUp } from '@meaku/saral';

interface SummarySuccessProps {
  content: string;
}

const savedMinutes = Math.floor(Math.random() * (20 - 15 + 1)) + 15; // Random number between 15-20

export const SummarySuccess = ({ content }: SummarySuccessProps) => {
  return (
    <>
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
          <Icons.Check className="size-4 bg-positive-dark rounded-full p-1 text-white" />
          Summary Complete
        </Typography>
      </div>
      <div className="text-gray-600 text-sm flex-1 overflow-y-auto">
        <TextArtifact content={content} />
      </div>
    </>
  );
};
