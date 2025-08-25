import React from 'react';
import { Typography } from '@meaku/saral';

interface AdminSessionHeaderProps {
  hasActiveAdminSession: boolean;
}

export const AdminSessionHeader: React.FC<AdminSessionHeaderProps> = ({ hasActiveAdminSession }) => {
  if (!hasActiveAdminSession) return null;

  return (
    <div className="sticky top-0 z-10 rounded-t-xl bg-background p-4 pb-1">
      <Typography variant="body" className="text-center border border-primary p-3 rounded-xl">
        Your Request is Being Handled by Our Expert
      </Typography>
    </div>
  );
};
