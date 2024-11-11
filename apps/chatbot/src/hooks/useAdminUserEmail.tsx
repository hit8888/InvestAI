import { useLocalStorageState } from 'ahooks';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorage';
import { ChatParams } from '@meaku/core/types/msc';
import useUpdateProspect from '@meaku/core/queries/mutation/useUpdateProspect';
import useIsAdmin from './useIsAdmin';
import useLocalStorageSession from './useLocalStorageSession';

const useAdminUserEmail = () => {
  const { orgName = '', agentId = '' } = useParams<ChatParams>();

  const userEmailKey = `${LOCAL_STORAGE_KEYS.USER_EMAIL}-${orgName}-${agentId}`;

  const { isAdmin } = useIsAdmin();
  const { mutateAsync: handleUpdateProspect } = useUpdateProspect();

  const [hasProspectBeenUpdated, setHasProspectBeenUpdated] = useState(false);
  const [userEmail, setUserEmail] = useLocalStorageState<string>(userEmailKey, {
    listenStorageChange: true,
  });
  const { sessionData } = useLocalStorageSession();

  const handleSetUserEmail = async (email: string) => {
    setUserEmail(email);

    if (isAdmin) {
      const data = await handleUpdateProspect({
        prospectId: sessionData.prospectId as string,
        payload: {
          email,
        },
      });

      if (data) {
        setHasProspectBeenUpdated(true);
      }
    }
  };

  return {
    userEmail,
    setUserEmail: handleSetUserEmail,
    hasProspectBeenUpdated,
    setHasProspectBeenUpdated,
  } as const;
};

export default useAdminUserEmail;
