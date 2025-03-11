import { Drawer, DrawerContent, DrawerOverlay } from '@breakout/design-system/components/Drawer/index';
import JoinConversationHeader from './JoinConversationHeader';
import JoinConversationChatAreaHeader from './JoinConversationChatAreaHeader';
import JoinConversationEntryPointInput from './JoinConversationEntryPointInput';
import JoinConversationRightSideBodyContent from './JoinConversationRightSideBodyContent';
import JoinConversationChatAreaBody from './JoinConversationChatAreaBody';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { cn } from '@breakout/design-system/lib/cn';

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
  const { hasJoinedConversation } = useJoinConversationStore();

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

  if (!isOpen) return null;

  return (
    <Drawer open={isOpen} onOpenChange={handleCloseJoinConversationDrawer} direction="bottom">
      <DrawerOverlay
        className="fixed inset-0 z-[1000] bg-transparent"
        style={{
          background: 'rgba(16, 24, 40, 0.04)',
        }}
      />
      <DrawerContent className="z-[1000] mx-auto -mb-1 h-[750px] w-full max-w-[calc(100%-24px)] rounded-3xl bg-primary-foreground 2xl:h-[870px]">
        {hasJoinedConversation && <JoinConversationHeader buyerIntentLabel={buyerIntentLabel} sessionId={sessionId} />}
        <div
          className={cn('w-full p-2', {
            'mt-2 h-[90%]': hasJoinedConversation,
            'h-full pt-0': !hasJoinedConversation,
          })}
        >
          <div className="flex h-[98%] w-full items-start justify-end gap-2 self-stretch rounded-2xl border border-gray-200 bg-gray-50 p-2">
            <JoinConversationLeftSideBodyContent sessionID={sessionId} />
            <JoinConversationRightSideBodyContent
              prospect={prospect}
              company={company}
              hasJoinedConversation={hasJoinedConversation}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const JoinConversationLeftSideBodyContent = ({ sessionID }: { sessionID: string }) => {
  return (
    <div className="group relative flex h-full w-full flex-1 flex-col items-start gap-2 self-stretch">
      <JoinConversationChatAreaContainer sessionID={sessionID} />
      <div className="absolute bottom-0 left-0 right-0">
        <JoinConversationEntryPointInput />
      </div>
    </div>
  );
};

const JoinConversationChatAreaContainer = ({ sessionID }: { sessionID: string }) => {
  const { hasJoinedConversation } = useJoinConversationStore();
  return (
    <div className="relative flex h-full w-full flex-1 flex-col items-start self-stretch rounded-lg pt-8">
      <JoinConversationChatAreaHeader />
      <JoinConversationChatAreaBody sessionID={sessionID} />
      {!hasJoinedConversation && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </div>
  );
};

export default JoinConversationDrawerContainerFlow;
