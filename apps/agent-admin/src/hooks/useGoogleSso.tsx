import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { ENV } from '@meaku/core/types/index';
import useLoginWithGoogleSso from '../queries/mutation/useLoginWithGoogleSso';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';

const REDIRECT_URI = `${window.location.origin}/auth/google/callback`;
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${ENV.VITE_GOOGLE_SSO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;

const useGoogleSso = () => {
  const [searchParams] = useSearchParams();
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

  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const initAuth = useCallback(() => {
    window.location.href = GOOGLE_AUTH_URL;
  }, []);

  useEffect(() => {
    if (code) {
      loginWithGoogleSso({ code, redirect_uri: REDIRECT_URI });
    } else if (error) {
      setTimeout(() => {
        toast.error('Authentication failed. Please try again.');
      });
      navigate(`/${AppRoutesEnum.LOGIN}`);
    }
  }, [code, error, loginWithGoogleSso, navigate]);

  return { initAuth, authInProgress: isLoginWithGoogleSsoPending };
};

export default useGoogleSso;
