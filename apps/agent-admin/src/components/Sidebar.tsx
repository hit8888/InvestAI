import React, { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import leadsicon from '../assets/leads-icons.svg';
import conversationsicon from '../assets/conversations-icons.svg';
import platgroundicon from '../assets/platground-icons.svg';
import panelClose from '../assets/panel-close.svg';
import actionDots from '../assets/dots.svg';
import defaultProfile from '../assets/default-profile.jpg';
import AdminLogoSVG from './AdminLogoSVG';
import { useAuth } from '../context/AuthProvider';
import useClickOutside from '@breakout/design-system/hooks/useClickOutside';

type NavLinkProps = {
  navUrl: string;
  navItem: string;
  isActive: boolean;
  navImg: string;
  isPanelOpen?: boolean;
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { userInfo } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return null;
  }
  const isLeadsPage = location.pathname === '/leads';
  const isConversationsPage = location.pathname === '/conversations';
  const isPlaygroundPage = location.pathname === '/playground';

  const NAV_LINK_ITEMS = [
    {
      navUrl: '/leads',
      navItem: 'Leads',
      navImg: leadsicon,
      isActive: isLeadsPage,
    },
    {
      navUrl: '/conversations',
      navItem: 'Conversations',
      navImg: conversationsicon,
      isActive: isConversationsPage,
    },
    {
      navUrl: '/playground',
      navItem: 'Playground',
      navImg: platgroundicon,
      isActive: isPlaygroundPage,
    },
  ];

  const profilePic = defaultProfile;
  const userName = userInfo?.username || 'Kymberly Abestango';

  return (
    <div
      className={`flex flex-col items-start border-r border-[#EDECFB] 2xl:h-screen ${isOpen ? 'w-[22%] 2xl:w-[15%]' : 'w-[75px] 2xl:w-[4%]'}`}
      style={{
        transition: 'width 0.3s',
      }}
    >
      <div
        className={`flex flex-shrink-0 flex-col items-start gap-4 self-stretch border border-[rgba(255,255,255,0.32)] bg-[#FBFBFE] px-2 pb-0 pt-4`}
      >
        <div className={`flex ${isOpen ? '' : 'flex-col'} w-full items-center justify-between gap-4 px-2`}>
          <div className="flex items-center gap-2 pl-2">
            <AdminLogoSVG />
            {isOpen ? (
              <span className="font-inter text-[16px] font-bold leading-normal tracking-[-0.16px] text-[#599AD9] transition-all duration-300">
                Breakout Admin
              </span>
            ) : null}
          </div>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center gap-[10px] rounded-lg bg-[#FBFBFE] pt-2"
          >
            <img
              src={panelClose}
              alt="arrow-icon"
              className={`h-[32px] w-[32px] transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
            />
          </button>
        </div>
        <div className="h-[2px] w-[95%] bg-[#EDECFB]"></div>
      </div>
      <div className="flex w-full flex-col items-start">
        {NAV_LINK_ITEMS.map((navItem) => (
          <NavLinkSingleItem key={navItem?.navItem} {...navItem} isPanelOpen={isOpen} />
        ))}
      </div>
      <div className="flex flex-1 flex-col items-start gap-4 self-stretch border border-[rgba(255,255,255,0.32)] bg-[#FBFBFE] px-2 py-4 pb-2">
        <div className="flex flex-1 flex-col items-start justify-end gap-2 self-stretch">
          <div className="h-[2px] w-[95%] bg-[#EDECFB]"></div>
          <div className="flex flex-col items-start justify-center gap-2 self-stretch rounded-2xl p-2">
            <div
              className={`flex ${isOpen ? '' : 'flex-col'} items-center gap-2 self-stretch transition-all duration-300`}
            >
              <div className="flex flex-1 items-center gap-[10px]">
                <div
                  className="bg-lightgray flex h-8 w-8 flex-col items-start gap-[10px] rounded-full border border-[rgba(255,255,255,0.32)] bg-cover bg-center bg-no-repeat p-[10px]"
                  style={{ backgroundImage: `url(${profilePic})` }}
                ></div>
                {isOpen ? (
                  <div className="flex w-[164px] flex-col items-start justify-center gap-0.5">
                    <p className="line-clamp-1 self-stretch overflow-hidden text-ellipsis font-inter text-[14px] font-semibold leading-[18px] text-[#4E46DC]">
                      {userName}
                    </p>
                  </div>
                ) : null}
              </div>
              <ThreeDotActionButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThreeDotActionButton = () => {
  const { logout } = useAuth();
  const actionBtnRef = useRef(null);
  const [isActionBtnClicked, setActionBtnClicked] = useState(false);

  // Use the custom hook to close the dropdown when clicking outside
  useClickOutside(actionBtnRef, () => setActionBtnClicked(false));
  return (
    <div className="relative">
      <button
        ref={actionBtnRef}
        onClick={() => setActionBtnClicked(!isActionBtnClicked)}
        type="button"
        aria-label="action-btn"
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#DCDAF8] bg-[#FBFBFE] p-2"
      >
        <img src={actionDots} alt="action-btn" />
      </button>
      {isActionBtnClicked ? (
        <button
          onClick={() => logout()}
          type="button"
          aria-label="logout-btn"
          className="absolute bottom-8 z-10 cursor-pointer rounded-lg border border-[#DCDAF8] bg-[#FBFBFE] p-2 text-[16px] leading-[20px] text-[#4E46DC]"
        >
          Logout
        </button>
      ) : null}
    </div>
  );
};

const NavLinkSingleItem = ({ navUrl, navItem, isActive, navImg, isPanelOpen }: NavLinkProps) => {
  return (
    <NavLink to={navUrl} className={`flex w-full cursor-pointer flex-col items-start gap-[10px] bg-[#FBFBFE] p-2`}>
      <div
        className={`flex w-full items-center gap-2 rounded-lg px-4 py-2 pr-2 ${isActive ? 'bg-[#EDECFB]' : 'bg-[#FBFBFE]'}`}
      >
        <div className={`flex items-center gap-[10px] rounded-lg p-1 ${isActive ? 'bg-[#FBFBFE]' : 'bg-[#EDECFB]'}`}>
          <img src={navImg} alt={`${navItem}-icon`} />
        </div>
        {isPanelOpen ? (
          <span
            className={` ${isActive ? 'text-[#101828]' : 'text-[#667085]'} font-inter text-[16px] font-medium leading-[22px] transition-all duration-300 ${
              isPanelOpen ? 'w-auto' : 'w-0 overflow-hidden'
            }`}
          >
            {navItem}
          </span>
        ) : null}
      </div>
    </NavLink>
  );
};

export default Sidebar;
