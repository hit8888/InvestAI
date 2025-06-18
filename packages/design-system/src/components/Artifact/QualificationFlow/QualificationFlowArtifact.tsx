import { useSlideArtifactScaleSystem } from '../../../hooks/useSlideArtifactScaleSystem';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useState } from 'react';
import { QualificationFlowArtifactProps } from './QualificationTypes';
import QualificationForm from './QualificationForm';
import QualificationQuestions from './QualificationQuestions';
import Typography from '../../Typography';
import Button from '../../Button';
import ArrowRight from '../../icons/ArrowRight';
import { QualificationQuestionMetadataType } from '@meaku/core/types/artifact';

const DEFAULT_FILLED_STATE_MESSAGES = {
  TITLE: 'Thanks for telling us about your business!',
  MESSAGE: 'You can create your account and get started',
  LABEL: 'Sign Up',
};

const QualificationFlowArtifact = ({ artifact, handleSendUserMessage, viewType }: QualificationFlowArtifactProps) => {
  const { ctaMetadata, is_filled, filled_data } = (artifact.metadata as QualificationQuestionMetadataType) ?? {};
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  const isQualificationFormFilled = Array.isArray(filled_data); // If its array - qualification Question
  const stepNumberBasedOnFormOrQuestionFilled = isQualificationFormFilled && is_filled ? 2 : 1;
  const [steps, setSteps] = useState(stepNumberBasedOnFormOrQuestionFilled);
  const isUserView = !['ADMIN', 'DASHBOARD'].includes(viewType ?? '');

  const handleIncrementSteps = () => {
    setSteps((steps) => steps + 1);
  };

  const handleSignUp = () => {
    window.open(ctaMetadata?.url, '_blank');
  };

  if (isQualificationFormFilled && isUserView) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Typography variant="title-24" className="text-center">
          {ctaMetadata?.title || DEFAULT_FILLED_STATE_MESSAGES.TITLE}
        </Typography>
        {ctaMetadata?.url && (
          <div className="flex flex-col items-center justify-center gap-6">
            <Typography variant="body-16" textColor="textPrimary" className="text-center">
              {ctaMetadata?.message || DEFAULT_FILLED_STATE_MESSAGES.MESSAGE}
            </Typography>
            <Button variant="system" onClick={handleSignUp}>
              {ctaMetadata?.label || DEFAULT_FILLED_STATE_MESSAGES.LABEL}
              <ArrowRight width="16" height="16" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <AspectRatio ratio={16 / 9}>
      <div ref={containerRef} className="relative aspect-video h-full w-full">
        <div
          className="relative z-10 h-full min-h-[900px] w-full min-w-[1600px] origin-top-left p-2"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {(!is_filled || !isQualificationFormFilled) && (
            <p className="w-full pb-6 pr-6 text-right text-2xl font-semibold text-gray-500">{`${steps} of 2`}</p>
          )}
          {steps === 1 ? (
            <QualificationForm
              handleIncrementSteps={handleIncrementSteps}
              artifact={artifact}
              handleSendUserMessage={handleSendUserMessage}
            />
          ) : null}
          {steps === 2 ? (
            <QualificationQuestions artifact={artifact} handleSendUserMessage={handleSendUserMessage} />
          ) : null}
        </div>
      </div>
    </AspectRatio>
  );
};

export default QualificationFlowArtifact;
