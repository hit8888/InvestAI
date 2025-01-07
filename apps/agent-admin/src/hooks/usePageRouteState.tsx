import { useLocation } from 'react-router-dom';
import { AppRoutesEnum } from '../utils/constants';
import { getPathUpToAdmin } from '../utils/common';

const usePageRouteState = () => {
  const location = useLocation();
  const { LEADS, PLAYGROUND, LOGIN, CONVERSATIONS } = AppRoutesEnum;

  const isDashboardPage = location.pathname === '/';
  const isLoginPage = location.pathname.includes(LOGIN);
  const isLeadsPage = location.pathname.includes(LEADS);
  const isConversationsPage = location.pathname.includes(CONVERSATIONS);
  const isPlaygroundPage = location.pathname.includes(PLAYGROUND);

  const pathUptoAdmin = getPathUpToAdmin(location.pathname);
  const pathURL = location.pathname;

  return {
    isDashboardPage,
    isLoginPage,
    isLeadsPage,
    isConversationsPage,
    isPlaygroundPage,
    pathUptoAdmin,
    pathURL,
  };
};

export default usePageRouteState;
