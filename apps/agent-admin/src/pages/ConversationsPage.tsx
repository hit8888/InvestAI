import ConversationsIcon from '@breakout/design-system/components/icons/conversations-icon';
import CustomPageHeader from '../components/CustomPageHeader';
import ConversationsTableContainer from '../components/ConversationsTableContainer';
import { FunnelData, PAGE_HEADER_TITLE_ICON_PROPS, CONVERSATIONS_PAGE_FUNNEL_DATA } from '../utils/constants';
import ColorFullChipLabel from '../components/ColorFullChipLabel';

const ConversationsPage = () => {
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <CustomPageHeader
          headerTitle="Conversations Page"
          headerIcon={<ConversationsIcon {...PAGE_HEADER_TITLE_ICON_PROPS} />}
        />
        <div className="flex h-64 w-full flex-col items-start gap-4 self-stretch rounded-2xl border p-4">
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full items-center gap-6">
              <p className="w-full flex-1 text-2xl font-semibold text-gray-900">Funnel of conversations</p>
              <div className="flex h-10 w-52 items-center gap-2 rounded-lg border border-primary/20 bg-primary/2.5 p-2"></div>
            </div>
            <div className="flex w-full items-center">
              {CONVERSATIONS_PAGE_FUNNEL_DATA.map((item: FunnelData) => (
                <ChipLabelWithNumericValueWrapper key={item.funnelKey} numericLabel={item.funnelNumericLabel}>
                  <ColorFullChipLabel chipType={item.funnelChipType} chipLabel={item.funnelChipLabel} />
                </ChipLabelWithNumericValueWrapper>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ConversationsTableContainer />
    </>
  );
};

interface ChipLabelWithNumericValueWrapperProps {
  children?: React.ReactNode;
  numericLabel: string;
}

const ChipLabelWithNumericValueWrapper: React.FC<ChipLabelWithNumericValueWrapperProps> = ({
  children,
  numericLabel,
}) => {
  return (
    <div className="flex flex-1 flex-col items-start gap-3 pb-3 pt-4">
      {children}
      <p className="self-stretch text-2xl font-extrabold text-gray-900">{numericLabel}</p>
    </div>
  );
};

export default ConversationsPage;
