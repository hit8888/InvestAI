import { useSlideArtifactScaleSystem } from '../../../hooks/useSlideArtifactScaleSystem';
import { AspectRatio } from '@radix-ui/react-aspect-ratio';
import { useEffect, useState } from 'react';
import QualificationForm from './QualificationForm';
import QualificationQuestions from './QualificationQuestions';
import {
  QualificationQuestionMetadataType,
  QualificationFlowArtifactProps,
  FormArtifactMetadataType,
} from '@neuraltrade/core/types/artifact';
import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';
import CtaEventMessage from '../../layout/ChatMessages/CtaEventMessage';

const QualificationFlowArtifact = ({ artifact, handleSendUserMessage, viewType }: QualificationFlowArtifactProps) => {
  const { qualificationQuestionFormMetadata: qualificationMetadata, formMetadata } = artifact.metadata as {
    qualificationQuestionFormMetadata: QualificationQuestionMetadataType;
    formMetadata: FormArtifactMetadataType;
  };
  const { ctaEvent } = artifact;
  const { is_filled, filled_data } = qualificationMetadata ?? {};
  const { is_filled: isFormFilled } = formMetadata;
  const { containerRef, scale } = useSlideArtifactScaleSystem();
  const isQualificationFormFilled = Array.isArray(filled_data) || is_filled; // If its array - qualification Question
  const stepNumberBasedOnFormOrQuestionFilled = isQualificationFormFilled || isFormFilled ? 2 : 1;
  const [steps, setSteps] = useState(stepNumberBasedOnFormOrQuestionFilled);
  const isUserView = !['ADMIN', 'DASHBOARD'].includes(viewType ?? '');

  const isMobile = useIsMobile();

  const handleIncrementSteps = () => {
    setSteps((steps) => steps + 1);
  };

  useEffect(() => {
    setSteps(stepNumberBasedOnFormOrQuestionFilled);
  }, [stepNumberBasedOnFormOrQuestionFilled]);

  const hasCTAEventMessage = isQualificationFormFilled && isUserView && ctaEvent;
  const showCTAEventMessageInMobile = hasCTAEventMessage && isMobile;

  if (hasCTAEventMessage && !isMobile) {
    return <CtaEventMessage event={ctaEvent} handleSendUserMessage={handleSendUserMessage} />;
  }

  const getQualificationFormContent = () => {
    return (
      <QualificationForm
        handleIncrementSteps={handleIncrementSteps}
        artifact={artifact}
        steps={steps}
        handleSendUserMessage={handleSendUserMessage}
      />
    );
  };

  const getQualificationFlowContent = () => {
    return (
      <>
        {(!is_filled || !isQualificationFormFilled) && !isMobile && (
          <p className="w-full pb-6 pr-6 text-right text-2xl font-semibold text-gray-500">{`${steps} of 2`}</p>
        )}
        {isMobile ? getQualificationFormContent() : null}
        {steps === 1 && !isMobile ? getQualificationFormContent() : null}
        {steps === 2 ? (
          <QualificationQuestions steps={steps} artifact={artifact} handleSendUserMessage={handleSendUserMessage} />
        ) : null}
        {showCTAEventMessageInMobile && (
          <CtaEventMessage event={ctaEvent} handleSendUserMessage={handleSendUserMessage} />
        )}
      </>
    );
  };

  if (isMobile) {
    return getQualificationFlowContent();
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
          {getQualificationFlowContent()}
        </div>
      </div>
    </AspectRatio>
  );
};

export default QualificationFlowArtifact;
