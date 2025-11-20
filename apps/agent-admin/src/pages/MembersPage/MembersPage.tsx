import { useMemo, useRef } from 'react';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import useIsAdmin from '../../utils/useIsAdmin';
import MembersTableContainer from './MembersTableContainer';
import withPageViewWrapper from '../PageViewWrapper';

const MembersPageBase = () => {
  const isAdmin = useIsAdmin();
  const createMemberHandlerRef = useRef<(() => void) | null>(null);

  const content = useMemo(() => {
    if (!isAdmin) {
      return (
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-8">
          <Typography variant="title-24" textColor="textPrimary" align="center">
            You need admin access to manage members.
          </Typography>
          <Typography variant="body-14" textColor="gray500" align="center">
            Contact an organization admin to request access.
          </Typography>
        </div>
      );
    }

    return (
      <MembersTableContainer
        onCreateMemberClick={(handler) => {
          createMemberHandlerRef.current = handler;
        }}
      />
    );
  }, [isAdmin]);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full items-start justify-between">
        <div className="flex-start flex flex-col">
          <Typography variant="title-24">Members</Typography>
          <Typography variant="body-14" textColor={'textSecondary'} className={'mt-2 max-w-xl'}>
            Manage the users in your dashboard and their permissions.
          </Typography>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => createMemberHandlerRef.current?.()} className="h-10">
            Add Member
          </Button>
        )}
      </div>
      {content}
    </div>
  );
};

const MembersPage = withPageViewWrapper(MembersPageBase);
export default MembersPage;
