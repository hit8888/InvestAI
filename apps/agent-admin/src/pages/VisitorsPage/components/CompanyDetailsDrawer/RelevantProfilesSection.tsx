import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import SpinnerIcon from '@breakout/design-system/components/icons/spinner';

type RelevantProfilesSectionProps = {
  onSearchProfiles: () => void;
  companyName?: string;
  disableSearchProfiles: boolean;
  showError: boolean;
  isLoadingProfiles: boolean;
};

const RelevantProfilesSection = ({
  onSearchProfiles,
  companyName,
  disableSearchProfiles,
  showError,
  isLoadingProfiles,
}: RelevantProfilesSectionProps) => {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1">
        <Typography variant="caption-12-medium">Relevant Profiles</Typography>
      </div>

      <div className="w-full rounded-2xl border border-gray-200 bg-gray-25 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <Typography variant="caption-12-normal" textColor="textSecondary" className="flex-1">
              {showError
                ? 'Nothing matched your search. Even our database blinked confused! 🤔'
                : `Look for relevant user profiles within ${companyName ?? 'the company'}. These could be users who have
              visited your website and could be a potential lead.`}
            </Typography>
            <Button
              variant="secondary"
              className="ml-4 flex flex-shrink-0 items-center gap-2"
              onClick={onSearchProfiles}
              disabled={disableSearchProfiles}
              leftIcon={
                isLoadingProfiles ? (
                  <SpinnerIcon width="16" height="16" className="text-brand-1000 animate-spin" />
                ) : (
                  <AiSparklesIcon width="16" height="16" className="text-brand-1000" />
                )
              }
            >
              Search Profiles
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelevantProfilesSection;
