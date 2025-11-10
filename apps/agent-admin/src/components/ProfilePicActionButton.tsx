import { Popover, PopoverContent, PopoverTrigger } from '@breakout/design-system/components/Popover/index';
import { useSessionStore } from '../stores/useSessionStore';
import { LOGOUT_BUTTON_TITLE } from '../utils/constants';
import defaultProfile from '../assets/default-profile.jpg';

const ProfilePicActionButton = () => {
  const logout = useSessionStore((state) => state.logout);
  const profilePic = defaultProfile;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Profile Button"
          className="flex h-8 w-8 rounded-full bg-cover bg-center bg-no-repeat p-2 ring-2 ring-[rgb(var(--primary-foreground)/0.24)] ring-offset-1"
          style={{ backgroundImage: `url(${profilePic})` }}
        />
      </PopoverTrigger>
      <PopoverContent sideOffset={12} className="relative z-50 ml-2 w-auto bg-white p-0">
        <button
          onClick={() => logout()}
          type="button"
          aria-label="Logout Button"
          className="cursor-pointer rounded-lg border border-primary/20 bg-primary/2.5 p-2 text-base text-primary"
        >
          {LOGOUT_BUTTON_TITLE}
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePicActionButton;
