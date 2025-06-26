import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { ENV } from '@meaku/core/types/index';
import useLoginWithGoogleSso from '../queries/mutation/useLoginWithGoogleSso';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';
import useOAuthPopup from '@meaku/core/hooks/useOAuthPopUp';

const REDIRECT_PATH = '/auth/google/callback';
const REDIRECT_URI = `${window.location.origin}${REDIRECT_PATH}`;
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${ENV.VITE_GOOGLE_SSO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;

const useGoogleSso = () => {
  const navigate = useNavigate();
  const { handleLoginAndRedirection, saveTokens } = useAuth();
  const { mutate: loginWithGoogleSso, isPending: isLoginWithGoogleSsoPending } = useLoginWithGoogleSso({
    /* eslint-disable @typescript-eslint/no-explicit-any */
    onSuccess: (data: any) => {
      saveTokens(data.access, data.refresh, data.user);
      handleLoginAndRedirection(data.user, (path) => {
        navigate(path);
      });
    },
    onError: () => {
      navigate(`/${AppRoutesEnum.LOGIN}`);
    },
  });
  const { openPopup } = useOAuthPopup({
    callbackPath: REDIRECT_PATH,
    onSuccess: (data) => {
      loginWithGoogleSso({ code: data.code, redirect_uri: REDIRECT_URI });
    },
    onError: () => {
      toast.error('Failed to login with Google SSO. Please try again.');
      navigate(`/${AppRoutesEnum.LOGIN}`);
    },
  });

  return { initAuth: () => openPopup(GOOGLE_AUTH_URL), authInProgress: isLoginWithGoogleSsoPending };
};

export default useGoogleSso;
