import { Icons, Typography } from '@meaku/saral';
import { TextArtifact } from '../../../features/ask-ai/Messages/TextArtifact';

interface SummarySuccessProps {
  content: string;
}

const savedMinutes = Math.floor(Math.random() * (20 - 15 + 1)) + 15; // Random number between 15-20

export const SummarySuccess = ({ content }: SummarySuccessProps) => {
  return (
    <>
      <div className="flex flex-col gap-3 bg-positive-dark rounded-xl p-3">
        <Typography variant="body-small" fontWeight="normal" className="text-white">
          You just saved
          <Typography variant="body-small" fontWeight="semibold" className="pl-1 inline">
            {savedMinutes} mins!
          </Typography>
        </Typography>
        <Typography
          variant="body"
          fontWeight="normal"
          className="flex items-center gap-2 text-white bg-positive-light p-3 rounded-xl"
        >
          <Icons.Check className="size-4 inline bg-white rounded-full p-1 text-positive-dark" />
          Summary Complete
        </Typography>
      </div>
      <div className="text-gray-600 text-sm flex-1 overflow-y-auto">
        <TextArtifact content={content} />
      </div>
    </>
  );
};
