import CustomPageHeader from '../components/CustomPageHeader';
import withPageViewWrapper from '../pages/PageViewWrapper';
import PanelPlaygroundActiveIcon from '@breakout/design-system/components/icons/panel-playground-active-icon';
import { COMMON_SMALL_ICON_PROPS } from '../utils/constants';
import { getTenantFromLocalStorage } from '../utils/common';
import useChatAgentScript from '../hooks/useChatAgentScript';
import { getUserEmailFromLocalStorage } from '@meaku/core/utils/index';
const PlaygroundPage = () => {
  const tenantName = getTenantFromLocalStorage();
  const userEmail = getUserEmailFromLocalStorage() || '';

  useChatAgentScript(tenantName, userEmail);

  return (
    <div className="w-full">
      <div className="flex flex-col items-start gap-1 self-stretch">
        <CustomPageHeader
          headerTitle="Playground"
          headerIcon={<PanelPlaygroundActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
        />
        <div className="flex h-[80vh] flex-col items-start gap-4 self-stretch">
          <div id="embedded-breakout-agent" className="relative h-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default withPageViewWrapper(PlaygroundPage);
