import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import { CircleUserRound } from 'lucide-react';

interface AdminExitInfoProps {
  adminName?: string;
  profileIconUrl?: string;
}

const PROFILE_ICON_WIDTH = 28;

const AdminExitInfo = ({ adminName = 'Admin', profileIconUrl }: AdminExitInfoProps) => {
  const scrollRef = useElementScrollIntoView<HTMLDivElement>();

  return (
    <div ref={scrollRef} className="flex justify-center py-4 pr-2">
      <div className="flex grow-0 items-center rounded-2xl bg-transparent_gray_3 p-4">
        <div className="mr-4 h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-300">
            {profileIconUrl ? (
              <img width={PROFILE_ICON_WIDTH} height={PROFILE_ICON_WIDTH} />
            ) : (
              <CircleUserRound size={PROFILE_ICON_WIDTH} />
            )}
          </div>
        </div>
        <h2 className="text-lg font-medium text-customPrimaryText">{adminName} left the chat</h2>
      </div>
    </div>
  );
};

export default AdminExitInfo;
