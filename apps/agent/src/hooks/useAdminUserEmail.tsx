import { useLocalStorageState } from 'ahooks';
import { useEffect, useState } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants/localStorage';
import useUpdateProspect from '@meaku/core/queries/mutation/useUpdateProspect';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import { useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';

const useAdminUserEmail = () => {
  const userEmailKey = `${LOCAL_STORAGE_KEYS.USER_EMAIL}`;

  const isAdmin = useIsAdmin();
  const { mutateAsync: handleUpdateProspect } = useUpdateProspect();

  const [hasProspectBeenUpdated, setHasProspectBeenUpdated] = useState(false);
  const [userEmail, setUserEmail] = useLocalStorageState<string>(userEmailKey, {
    listenStorageChange: true,
  });
  const { sessionData } = useLocalStorageSession();

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
