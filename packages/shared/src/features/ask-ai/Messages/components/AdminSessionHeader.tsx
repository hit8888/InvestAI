import React from 'react';
import { Typography } from '@meaku/saral';

interface AdminSessionHeaderProps {
  hasActiveAdminSession: boolean;
}

export const AdminSessionHeader: React.FC<AdminSessionHeaderProps> = ({ hasActiveAdminSession }) => {
  if (!hasActiveAdminSession) return null;

  return (
    <div className="sticky top-0 z-10 rounded-t-xl bg-background p-2 flex justify-center">
      <Typography
        variant="body"
        className="text-center font-medium border bg-primary/10 rounded-xl max-w-md px-4 py-1 text-primary"
      >
        Your Request is Being Handled by Our Expert
      </Typography>
    </div>
  );
};
