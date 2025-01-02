import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import useClickOutside from '@breakout/design-system/hooks/useClickOutside';
import { LOGOUT_BUTTON_TITLE } from '../utils/constants';
import defaultProfile from '../assets/default-profile.jpg';

const ProfilePicActionButton = () => {
  const { logout } = useAuth();
  const actionBtnRef = useRef<HTMLButtonElement>(null!);
  const [isActionBtnClicked, setActionBtnClicked] = useState(false);

  // Use the custom hook to close the dropdown when clicking outside
  useClickOutside(actionBtnRef, () => setActionBtnClicked(false));

  const profilePic = defaultProfile;
  return (
    <div className="relative">
      <button
        ref={actionBtnRef}
        onClick={() => setActionBtnClicked(!isActionBtnClicked)}
        type="button"
        aria-label="profile-btn"
        className="flex h-8 w-8 rounded-full border border-[rgb(var(--primary-foreground)/0.32)] bg-cover bg-center bg-no-repeat p-[6px]"
        style={{ backgroundImage: `url(${profilePic})` }}
      ></button>
      {isActionBtnClicked ? (
        <button
          onClick={() => logout()}
          type="button"
          aria-label="logout-btn"
          className="absolute bottom-8 z-10 cursor-pointer rounded-lg border border-primary/20 bg-primary/2.5 p-2 text-base text-primary"
        >
          {LOGOUT_BUTTON_TITLE}
        </button>
      ) : null}
    </div>
  );
};

export default ProfilePicActionButton;
