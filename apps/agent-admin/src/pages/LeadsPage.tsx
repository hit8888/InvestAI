import CustomPageHeader from '../components/CustomPageHeader';
import withPageViewWrapper from '../pages/PageViewWrapper';
import LeadsTableContainer from '../components/LeadsTableContainer';
import { COMMON_SMALL_ICON_PROPS, LEADS_PAGE_COLUMN_LISTS, LINK_CLICKS_PAGE_COLUMN_LISTS } from '../utils/constants';
import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import ConversationTabs from '../components/ConversationTabs';
import usePageRouteState from '../hooks/usePageRouteState';
import { LEADS_PAGE, LINK_CLICKS_PAGE } from '@meaku/core/utils/index';

// TODOS: COMMENTED CODE WILL BE USED LATER ON

const LeadsPage = () => {
  const { isLinkClicksPage } = usePageRouteState();

  // const totalNumberOfLeads = 1;
  return (
    <>
      <CustomPageHeader
        headerTitle="Conversations"
        headerIcon={<PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
      />
      <ConversationTabs />
      {/* <div className="flex h-64 w-full rounded-2xl border border-primary/10 p-4">
          <div className="flex w-full flex-col items-start gap-4 self-stretch">
            <div className="flex w-full items-center gap-6 self-stretch">
              <div className="flex w-full items-center gap-6">
                <p className="text-2xl font-semibold text-gray-900">Leads for the period</p>
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 animate-pulse items-center justify-center rounded-md bg-primary/20 p-2.5 2xl:h-8 2xl:w-8">
                    <div className="flex h-3 w-3 flex-shrink-0 animate-pulse rounded-sm bg-primary 2xl:h-5 2xl:w-5"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-normal text-gray-500">Total:</p>
                    <p className="text-sm font-medium text-gray-900">{totalNumberOfLeads} Lead</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-1 items-start">
                <div className="flex h-10 w-80 items-center gap-2 rounded-lg border border-primary/20 bg-primary/2.5 p-2"></div>
              </div>
            </div>
          </div>
        </div> */}
      <LeadsTableContainer
        key={isLinkClicksPage ? LINK_CLICKS_PAGE : LEADS_PAGE}
        pageType={isLinkClicksPage ? LINK_CLICKS_PAGE : LEADS_PAGE}
        columnList={isLinkClicksPage ? LINK_CLICKS_PAGE_COLUMN_LISTS : LEADS_PAGE_COLUMN_LISTS}
      />
    </>
  );
};

export default withPageViewWrapper(LeadsPage);
