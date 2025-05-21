import { motion } from 'framer-motion';
import usePageRouteState from '../../hooks/usePageRouteState';
import { useSidebar } from '../../context/SidebarContext';
import CompanyHeaderCTA from './CompanyHeaderCTA';
import NavigationBodyItems from './NavigationBodyItems';
import UserProfileCTA from './UserProfileCTA';

const getSidebarContainerAnimation = (isOpen: boolean) => ({
  animate: {
    width: isOpen
      ? ['80px', '144px', '200px', '256px', '270px'] // expanding
      : ['270px', '256px', '200px', '144px', '80px'], // collapsing
  },
  transition: {
    duration: 0.5,
    ease: [0.25, 0.5, 0.75, 1], // custom easing function
    times: [0, 0.25, 0.5, 0.75, 1], // keyframe timings
  },
});

const Sidebar = () => {
  const { isLoginPage } = usePageRouteState();
  const { isSidebarOpen: isOpen, toggleSidebar } = useSidebar();

  if (isLoginPage) {
    return null;
  }

  return (
    <motion.div
      className="sticky top-0 z-50 flex h-screen flex-col items-start border-r border-primary/10"
      {...getSidebarContainerAnimation(isOpen)}
    >
      <CompanyHeaderCTA isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <NavigationBodyItems isOpen={isOpen} />
      <UserProfileCTA isOpen={isOpen} />
    </motion.div>
  );
};

export default Sidebar;
