import { useSlideArtifactScaleSystem } from '../../../hooks/useSlideArtifactScaleSystem';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useState } from 'react';
import { QualificationFlowArtifactProps } from './QualificationTypes';
import QualificationForm from './QualificationForm';
import QualificationQuestions from './QualificationQuestions';

const QualificationFlowArtifact = ({ artifact, handleSendUserMessage }: QualificationFlowArtifactProps) => {
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  const isQualificationQuestionFilled = artifact.metadata.is_filled;
  const [steps, setSteps] = useState(isQualificationQuestionFilled ? 2 : 1);

  const handleIncrementSteps = () => {
    setSteps((steps) => steps + 1);
  };

  return (
    <AspectRatio ratio={16 / 9}>
      <div ref={containerRef} className="relative aspect-video w-full">
        <div
          className="relative z-50 h-full w-full origin-top-left p-2"
          style={{
            transform: `scale(${scale})`,
            minHeight: '900px',
            minWidth: '1600px',
          }}
        >
          {!isQualificationQuestionFilled && (
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
