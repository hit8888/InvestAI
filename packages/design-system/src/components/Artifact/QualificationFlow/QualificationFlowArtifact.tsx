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

const QualificationFlowArtifact = ({ artifact, handleSendUserMessage, viewType }: QualificationFlowArtifactProps) => {
  const { sign_up_url, is_filled, filled_data } = (artifact.metadata as QualificationQuestionMetadataType) ?? {};
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  const isQualificationFormFilled = Array.isArray(filled_data); // If its array - qualification Question
  const stepNumberBasedOnFormOrQuestionFilled = isQualificationFormFilled && is_filled ? 2 : 1;
  const [steps, setSteps] = useState(stepNumberBasedOnFormOrQuestionFilled);
  const isUserView = !['ADMIN', 'DASHBOARD'].includes(viewType ?? '');

  const handleIncrementSteps = () => {
    setSteps((steps) => steps + 1);
  };

  const handleSignUp = () => {
    window.open(sign_up_url, '_blank');
  };

  if (is_filled && isUserView) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Typography variant="title-24" className="text-center">
          Thanks for telling us about your business!
        </Typography>
        {sign_up_url && (
          <div className="flex flex-col items-center justify-center gap-6">
            <Typography variant="body-16" textColor="textPrimary" className="text-center">
              You can create your account and get started
            </Typography>
            <Button variant="system" onClick={handleSignUp}>
              Sign Up
              <ArrowRight width="16" height="16" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-full [&_[data-radix-aspect-ratio-wrapper]]:!h-full [&_[data-radix-aspect-ratio-wrapper]]:!pb-0">
      <AspectRatio ratio={16 / 9}>
        <div ref={containerRef} className="relative aspect-video h-full w-full">
          <div
            className="relative z-10 h-full w-full origin-top-left p-2"
            style={{
              transform: `scale(${scale})`,
              minHeight: '900px',
              minWidth: '1600px',
            }}
          >
            {!is_filled && (
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
    </div>
  );
};

export default QualificationFlowArtifact;
