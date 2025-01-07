import { useLocation } from 'react-router-dom';
import { AppRoutesEnum } from '../utils/constants';

const usePageRouteState = () => {
  const location = useLocation();
  const { LEADS, PLAYGROUND, LOGIN, CONVERSATIONS } = AppRoutesEnum;

  const isDashboardPage = location.pathname === '/';
  const isLoginPage = location.pathname.includes(LOGIN);
  const isLeadsPage = location.pathname.includes(LEADS);
  const isConversationsPage = location.pathname.includes(CONVERSATIONS);
  const isPlaygroundPage = location.pathname.includes(PLAYGROUND);

  const pathURL = location.pathname;

  return {
    isDashboardPage,
    isLoginPage,
    isLeadsPage,
    isConversationsPage,
    isPlaygroundPage,
    pathURL,
  };
};

export default usePageRouteState;
