import { useEffect, useState } from 'react';
import QualificationForm from './QualificationForm';
import QualificationQuestions from './QualificationQuestions';
import {
  QualificationQuestionMetadataType,
  QualificationFlowArtifactProps,
  FormArtifactMetadataType,
} from '../../../../utils/artifact';
import CtaEventMessage from '../CtaEventMessage';

const QualificationFlowArtifact = ({ artifact, handleSendUserMessage, viewType }: QualificationFlowArtifactProps) => {
  const { qualificationQuestionFormMetadata: qualificationMetadata, formMetadata } = artifact.metadata as {
    qualificationQuestionFormMetadata: QualificationQuestionMetadataType;
    formMetadata: FormArtifactMetadataType;
  };
  const { ctaEvent } = artifact;
  const { is_filled, filled_data } = qualificationMetadata ?? {};
  const { is_filled: isFormFilled } = formMetadata;
  const isQualificationFormFilled = Array.isArray(filled_data) || is_filled; // If its array - qualification Question

  const stepNumberBasedOnFormOrQuestionFilled = isQualificationFormFilled ? 3 : isFormFilled ? 2 : 1;
  const [steps, setSteps] = useState(stepNumberBasedOnFormOrQuestionFilled);
  const isUserView = !['ADMIN', 'DASHBOARD'].includes(viewType ?? '');

  const handleIncrementSteps = () => {
    setSteps((steps) => steps + 1);
  };

  useEffect(() => {
    setSteps(stepNumberBasedOnFormOrQuestionFilled);
  }, [stepNumberBasedOnFormOrQuestionFilled]);

  const hasCTAEventMessage = isQualificationFormFilled && isUserView && ctaEvent;

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

  return (
    <>
      {steps === 1 && getQualificationFormContent()}
      {steps === 2 ? (
        <QualificationQuestions
          handleIncrementSteps={handleIncrementSteps}
          artifact={artifact}
          handleSendUserMessage={handleSendUserMessage}
        />
      ) : null}
      {hasCTAEventMessage && <CtaEventMessage event={ctaEvent} handleSendUserMessage={handleSendUserMessage} />}
    </>
  );
};

export default QualificationFlowArtifact;
