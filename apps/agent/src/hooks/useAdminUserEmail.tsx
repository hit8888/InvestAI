import { useLocalStorageState } from 'ahooks';
import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorage';
import useUpdateProspect from '@meaku/core/queries/mutation/useUpdateProspect';
import { useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';

const useAdminUserEmail = () => {
  const userEmailKey = `${LOCAL_STORAGE_KEYS.USER_EMAIL}`;

  const isAdmin = useIsAdmin();
  const { mutateAsync: handleUpdateProspect } = useUpdateProspect();

  const [hasProspectBeenUpdated, setHasProspectBeenUpdated] = useState(false);
  const [userEmail, setUserEmail] = useLocalStorageState<string>(userEmailKey, {
    listenStorageChange: true,
  });

  const prospectId = useSessionApiResponseManager()?.getProspectId();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailFromUrl = urlParams.get('email');
    if (emailFromUrl && userEmail != emailFromUrl) {
      handleSetUserEmail(emailFromUrl);
    }
  }, [userEmail]);

  const handleSetUserEmail = async (email: string) => {
    setUserEmail(email);

    if (isAdmin) {
      // Wait for prospectId to be available
      if (!prospectId) {
        console.log('Waiting for prospectId to be available...');
        return;
      }

      const data = await handleUpdateProspect({
        prospectId: prospectId as string,
        payload: {
          email,
        },
      });

      if (data) {
        setHasProspectBeenUpdated(true);
      }
    }
  };

  // Effect to handle email update when prospectId becomes available
  useEffect(() => {
    if (isAdmin && userEmail && prospectId && !hasProspectBeenUpdated) {
      handleUpdateProspect({
        prospectId: prospectId as string,
        payload: {
          email: userEmail,
        },
      }).then((data) => {
        if (data) {
          setHasProspectBeenUpdated(true);
        }
      });
    }
  }, [prospectId, userEmail, isAdmin, hasProspectBeenUpdated]);

  return {
    userEmail,
    setUserEmail: handleSetUserEmail,
    hasProspectBeenUpdated,
    setHasProspectBeenUpdated,
  } as const;
};

export default useAdminUserEmail;
