import { useSlideArtifactScaleSystem } from '../../../hooks/useSlideArtifactScaleSystem';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useState } from 'react';
import { QualificationFlowArtifactProps } from './QualificationTypes';
import QualificationForm from './QualificationForm';
import QualificationQuestions from './QualificationQuestions';
import { QualificationQuestionMetadataType } from '@meaku/core/types/artifact';
import CtaEventMessage from '../../layout/ChatMessages/CtaEventMessage';

const QualificationFlowArtifact = ({ artifact, handleSendUserMessage, viewType }: QualificationFlowArtifactProps) => {
  const { ctaEvent } = artifact;
  const { is_filled, filled_data } = (artifact.metadata as QualificationQuestionMetadataType) ?? {};
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  const isQualificationFormFilled = Array.isArray(filled_data); // If its array - qualification Question
  const stepNumberBasedOnFormOrQuestionFilled = isQualificationFormFilled && is_filled ? 2 : 1;
  const [steps, setSteps] = useState(stepNumberBasedOnFormOrQuestionFilled);
  const isUserView = !['ADMIN', 'DASHBOARD'].includes(viewType ?? '');

  const handleIncrementSteps = () => {
    setSteps((steps) => steps + 1);
  };

  if (isQualificationFormFilled && isUserView && ctaEvent) {
    return <CtaEventMessage event={ctaEvent} handleSendUserMessage={handleSendUserMessage} />;
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
