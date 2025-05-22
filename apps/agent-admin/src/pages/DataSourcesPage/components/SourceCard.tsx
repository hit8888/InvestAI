import React from 'react';
import SourcesCardHeader from './SourcesCardHeader';
import Card from '../../../components/AgentManagement/Card';

interface SourceCardProps {
  cardTitle: string;
  children?: React.ReactNode;
}

const SourceCard: React.FC<SourceCardProps> = ({ cardTitle, children }) => {
  return (
    <Card background="WHITE" border="GRAY200" className="sources-card-shadow max-w-3xl gap-4 p-4">
      <SourcesCardHeader cardTitle={cardTitle} />
      <div className="w-full border border-b border-gray-100"></div>
      {children}
    </Card>
  );
};

export default SourceCard;
