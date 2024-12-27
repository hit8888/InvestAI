import CustomPageHeader from '../components/CustomPageHeader';
import { useAuth } from '../context/AuthProvider';
import PlaygroundIcon from '@breakout/design-system/components/icons/playground-icons';

const PlaygroundPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="w-full">
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader headerTitle="Playground Page" headerIcon={<PlaygroundIcon />} />
        <div className="flex h-[270px] flex-col items-start gap-4 self-stretch rounded-2xl border border-[#EDECFB] p-4"></div>
      </div>
      <div></div>
    </div>
  );
};

export default PlaygroundPage;
