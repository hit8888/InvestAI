import { ChatParams } from '@meaku/core/types/config';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const useInitializeRequestHeaderfromUrl = () => {
  const { orgName = '' } = useParams<ChatParams>();

  useEffect(() => {
    localStorage.setItem('x-tenant-name', orgName);
  }, [orgName]);
};

export { useInitializeRequestHeaderfromUrl };
