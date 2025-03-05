import { Drawer, DrawerContent, DrawerOverlay } from '@breakout/design-system/components/Drawer/index';
import JoinConversationHeader from './JoinConversationHeader';
import JoinConversationChatAreaHeader from './JoinConversationChatAreaHeader';
import JoinConversationEntryPointInput from './JoinConversationEntryPointInput';
import JoinConversationRightSideBodyContent from './JoinConversationRightSideBodyContent';
import JoinConversationChatAreaBody from './JoinConversationChatAreaBody';

type JoinConversationDrawerContainerFlowProps = {
  sessionId: string;
  buyerIntentLabel: string;
  isOpen: boolean;
  handleCloseJoinConversationDrawer: () => void;
};

const JoinConversationDrawerContainerFlow = ({
  sessionId,
  buyerIntentLabel,
  isOpen,
  handleCloseJoinConversationDrawer,
}: JoinConversationDrawerContainerFlowProps) => {
  if (!isOpen) return null;

  const prospect = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    company: 'Example Inc.',
    role: 'Software Engineer',
    location: {
      city: 'New York',
      country: 'NY',
    },
  };

  const company = {
    name: 'Example Inc.',
    email: 'example@example.com',
    phone: '+1234567890',
    location: 'United States',
    revenue: '$100,000',
    employees: '10',
    domain: 'example.com',
    foundationDate: '2020-01-01',
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleCloseJoinConversationDrawer} direction="bottom">
      <DrawerOverlay
        className="fixed inset-0 z-[1000] bg-transparent"
        style={{
          background: 'rgba(16, 24, 40, 0.04)',
        }}
      />
      <DrawerContent className="z-[1000] mx-auto -mb-1 h-[750px] w-full max-w-[calc(100%-24px)] rounded-3xl bg-primary-foreground 2xl:h-[870px]">
        <JoinConversationHeader buyerIntentLabel={buyerIntentLabel} sessionId={sessionId} />
        <div className="mt-2 h-[90%] w-full p-2">
          <div className="flex h-full w-full items-start justify-end gap-2 self-stretch rounded-2xl border border-gray-200 bg-gray-50 p-2">
            <JoinConversationLeftSideBodyContent />
            <JoinConversationRightSideBodyContent prospect={prospect} company={company} />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const JoinConversationLeftSideBodyContent = () => {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-start gap-2">
      <JoinConversationChatAreaContainer />
      <JoinConversationEntryPointInput />
    </div>
  );
};

const JoinConversationChatAreaContainer = () => {
  return (
    <div className="relative flex h-full w-full flex-1 flex-col items-start self-stretch rounded-lg">
      <JoinConversationChatAreaHeader showExitButton={true} />
      <JoinConversationChatAreaBody />
    </div>
  );
};

export default JoinConversationDrawerContainerFlow;
