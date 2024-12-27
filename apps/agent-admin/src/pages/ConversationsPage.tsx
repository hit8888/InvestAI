import CustomPageHeader from '../components/CustomPageHeader';
import { useAuth } from '../context/AuthProvider';
import ConversationsIcon from '@breakout/design-system/components/icons/conversations-icon';

const ConversationsPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="w-full">
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader headerTitle="Conversations Page" headerIcon={<ConversationsIcon />} />
        <div className="flex h-[270px] flex-col items-start gap-4 self-stretch rounded-2xl border border-[#EDECFB] p-4"></div>
      </div>
      <div></div>
    </div>
  );
};

export default ConversationsPage;
