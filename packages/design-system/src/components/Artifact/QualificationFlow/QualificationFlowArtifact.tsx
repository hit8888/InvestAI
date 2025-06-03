import { useSlideArtifactScaleSystem } from '../../../hooks/useSlideArtifactScaleSystem';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useState } from 'react';
import { QualificationFlowArtifactProps } from './QualificationTypes';
import QualificationForm from './QualificationForm';
import QualificationQuestions from './QualificationQuestions';

const QualificationFlowArtifact = ({ artifact, handleSendUserMessage }: QualificationFlowArtifactProps) => {
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  const isQualificationFormFilled = Array.isArray(artifact.metadata?.filled_data); // If its array - qualification Question
  const stepNumberBasedOnFormOrQuestionFilled = isQualificationFormFilled && artifact.metadata.is_filled ? 2 : 1;
  const [steps, setSteps] = useState(stepNumberBasedOnFormOrQuestionFilled);

  const handleIncrementSteps = () => {
    setSteps((steps) => steps + 1);
  };

  return (
    <div className="h-full w-full [&_[data-radix-aspect-ratio-wrapper]]:!h-full [&_[data-radix-aspect-ratio-wrapper]]:!pb-0">
      <AspectRatio ratio={16 / 9}>
        <div ref={containerRef} className="relative aspect-video w-full">
          <div
            className="relative z-10 h-full w-full origin-top-left p-2"
            style={{
              transform: `scale(${scale})`,
              minHeight: '900px',
              minWidth: '1600px',
            }}
          >
            {!artifact.metadata.is_filled && (
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
