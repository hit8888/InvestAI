// TODOS: COMMENTED CODE WILL BE USED LATER ON

import PanelConversationActiveIcon from '@breakout/design-system/components/icons/panel-conversation-active-icon';
import withPageViewWrapper from '../pages/PageViewWrapper';
import CustomPageHeader from '../components/CustomPageHeader';
import ConversationsTableContainer from '../components/ConversationsTableContainer';
import {
  COMMON_SMALL_ICON_PROPS,
  // FunnelData,
} from '../utils/constants';
import ActiveConversationsLayout from '../components/ActiveConversationsComp/ActiveConversationsLayout';
import { ActiveConversationsProvider } from '../context/ActiveConversationsContext';

const ConversationsPage = () => {
  // const { data, isLoading, isError } = useConversationsFunnelDataQuery({
  //   tenantName: tenantName || '',
  //   queryOptions: {
  //     enabled: !!tenantName,
  //   },
  // });

  // // Validate using the schema
  // const result = ConversationFunnelResponseSchema.safeParse(data);
  // let tranformedData: FunnelData[];

  // if (result.success) {
  //   tranformedData = transformFunnelData(result.data.steps);
  // }

  // const showFunnelData = () => {
  //   let content;
  //   if (isError) {
  //     content = <p className="w-full text-center text-2xl font-semibold text-gray-900">No Funnel Data</p>;
  //   } else if (isLoading) {
  //     content = <p className="w-full text-center text-2xl font-semibold text-gray-900">Loading ...</p>;
  //   } else {
  //     content = (
  //       <div className="flex w-full items-center">
  //         {tranformedData.map((item: FunnelData) => (
  //           <ChipLabelWithNumericValueWrapper key={item.funnelKey} numericLabel={item.funnelNumericLabel}>
  //             <ColorFullChipLabel chipType={item.funnelChipType} chipLabel={item.funnelChipLabel} />
  //           </ChipLabelWithNumericValueWrapper>
  //         ))}
  //       </div>
  //     );
  //   }
  //   return content;
  // };

  // TODO: Toggle below variable for development purposes.
  // Remove this when the active conversations are implemented and integrated with the backend
  const showActiveConversations = false;

  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader
          headerTitle="Conversations"
          headerIcon={<PanelConversationActiveIcon {...COMMON_SMALL_ICON_PROPS} />}
        />
        {showActiveConversations && (
          <ActiveConversationsProvider>
            <ActiveConversationsLayout />
          </ActiveConversationsProvider>
        )}
        {/* <div className="flex h-64 w-full flex-col items-start gap-4 self-stretch rounded-2xl border p-4">
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full items-center gap-6">
              <p className="w-full flex-1 text-2xl font-semibold text-gray-900">Funnel of conversations</p>
              <div className="bg-primary/2.5 flex h-10 w-52 items-center gap-2 rounded-lg border border-primary/20 p-2"></div>
            </div>
            {showFunnelData()}
          </div>
        </div> */}
      </div>
      <ConversationsTableContainer />
    </>
  );
};

// interface ChipLabelWithNumericValueWrapperProps {
//   children?: React.ReactNode;
//   numericLabel: string;
// }

// const ChipLabelWithNumericValueWrapper: React.FC<ChipLabelWithNumericValueWrapperProps> = ({
//   children,
//   numericLabel,
// }) => {
//   return (
//     <div className="flex flex-1 flex-col items-start gap-3 pb-3 pt-4">
//       {children}
//       <p className="self-stretch text-2xl font-extrabold text-gray-900">{numericLabel}</p>
//     </div>
//   );
// };

export default withPageViewWrapper(ConversationsPage);
