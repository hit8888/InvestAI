import QualificationQuestions from './QualificationQuestions';
import { QualificationFlowArtifactProps } from '../../../../utils/artifact';

const QualificationFlowArtifact = ({ artifact, handleSendUserMessage }: QualificationFlowArtifactProps) => {
  return <QualificationQuestions artifact={artifact} handleSendUserMessage={handleSendUserMessage} />;
};

export default QualificationFlowArtifact;
