import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  URL_ROUTE_CONVERSATIONS_PAGE,
  URL_ROUTE_LEADS_PAGE,
  URL_ROUTE_LOGIN_PAGE,
  URL_ROUTE_PLAYGROUND_PAGE,
} from '../utils/constants';

const useSidebarAndPageState = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const isLoginPage = location.pathname === URL_ROUTE_LOGIN_PAGE;
  const isLeadsPage = location.pathname === URL_ROUTE_LEADS_PAGE;
  const isConversationsPage = location.pathname === URL_ROUTE_CONVERSATIONS_PAGE;
  const isPlaygroundPage = location.pathname === URL_ROUTE_PLAYGROUND_PAGE;

  return {
    isSidebarOpen,
    toggleSidebar,
    isLoginPage,
    isLeadsPage,
    isConversationsPage,
    isPlaygroundPage,
  };
};

export default useSidebarAndPageState;
