// CardContext.jsx
import React, { createContext, useState } from 'react';

export type ActiveConversationCard = {
  sessionId: string;
  companyLogoUrl: string;
  companyName: string;
  userName: string;
  location: {
    city: string;
    country: string;
  };
  duration: string;
  messageCount: number;
  lastInput: string;
  timePassedAfterInactive: string;
  isTyping: boolean;
  isActive: boolean;
  buyerIntentLabel: string;
};

type ActiveConversationsContextType = {
  cards: ActiveConversationCard[];
  setCards: (newCards: ActiveConversationCard[]) => void;
};

const defaultContext: ActiveConversationsContextType = {
  cards: [],
  setCards: () => {},
};

// Create the context
export const ActiveConversationsContext = createContext<ActiveConversationsContextType>(defaultContext);

// TODO: Uncomment below code for development purposes.
// Remove this sample data for cards when the active conversations are implemented and integrated with the backend
// const mockCardsData: ActiveConversationCard[] = [
//   {
//     sessionId: '34cf53d1-eb5c-4f3e-983c-d1da8aeb8159',
//     companyLogoUrl: 'https://www.luminous.com/assets/images/logo.svg',
//     companyName: 'Luminous',
//     userName: 'Danielle Kelzon',
//     location: {
//       city: 'Bellevue',
//       country: 'United States',
//     },
//     duration: '15',
//     messageCount: 54,
//     lastInput: 'What subscription plans do you offer, and how do they differ?',
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: true,
//     buyerIntentLabel: 'High',
//   },
//   {
//     sessionId: '615ed51d-37cd-4926-beb8-c8b98c9beb66',
//     companyLogoUrl: '',
//     companyName: '',
//     userName: 'Michael Chen',
//     location: {
//       city: 'San Francisco',
//       country: 'United States',
//     },
//     duration: '32',
//     messageCount: 87,
//     lastInput: 'Can you explain the key features of your enterprise plan?',
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: false,
//     buyerIntentLabel: 'Medium',
//   },
//   {
//     sessionId: '40e95c96-9de1-4431-8fb0-f7450a1e8619',
//     companyLogoUrl: 'https://www.pulse.com/assets/images/logo.svg',
//     companyName: 'Pulse',
//     userName: 'Sarah Johnson',
//     location: {
//       city: 'New York',
//       country: 'United States',
//     },
//     duration: '8',
//     messageCount: 23,
//     lastInput: 'I need help troubleshooting my integration with your API.',
//     timePassedAfterInactive: '10',
//     isTyping: true,
//     isActive: true,
//     buyerIntentLabel: 'Low',
//   },
//   {
//     sessionId: 'b15bff57-194a-4ac4-8f00-5746c16432e8',
//     companyLogoUrl: '',
//     companyName: '',
//     userName: 'James Wilson',
//     location: {
//       city: 'London',
//       country: 'United Kingdom',
//     },
//     duration: '45',
//     messageCount: 112,
//     lastInput: 'How can I upgrade my current plan to include more users?',
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: true,
//     buyerIntentLabel: 'Low',
//   },
//   {
//     sessionId: '6f5536d8-885a-4b38-a532-dc359de22475',
//     companyLogoUrl: 'https://www.zenith.com/assets/images/logo.svg',
//     companyName: 'Zenith',
//     userName: 'Emily Rodriguez',
//     location: {
//       city: 'Austin',
//       country: 'United States',
//     },
//     duration: '20',
//     messageCount: 42,
//     lastInput: 'What security certifications does your platform have?',
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: false,
//     buyerIntentLabel: 'Medium',
//   },
//   {
//     sessionId: '40d6aee2-ca7d-4085-85fd-65f8bd8743b4',
//     companyLogoUrl: '',
//     companyName: '',
//     userName: 'David Kim',
//     location: {
//       city: 'Toronto',
//       country: 'Canada',
//     },
//     duration: '17',
//     messageCount: 38,
//     lastInput: 'Can we schedule a demo for our team next week?',
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: true,
//     buyerIntentLabel: 'Low',
//   },
//   {
//     sessionId: 'a2581b51-253c-4364-b556-5675c0792a8b',
//     companyLogoUrl: 'https://www.luminous.com/assets/images/logo.svg',
//     companyName: 'Luminous',
//     userName: 'Sophia Martinez',
//     location: {
//       city: 'Chicago',
//       country: 'United States',
//     },
//     duration: '55',
//     messageCount: 143,
//     lastInput: 'How does your data retention policy work for the premium tier?',
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: true,
//     buyerIntentLabel: 'Low',
//   },
//   {
//     sessionId: 'b878fb30-8048-4ea6-aab5-3504480a7707',
//     companyLogoUrl: 'https://www.horizon.com/assets/images/logo.svg',
//     companyName: 'Horizon',
//     userName: 'Robert Taylor',
//     location: {
//       city: 'Sydney',
//       country: 'Australia',
//     },
//     duration: '28',
//     messageCount: 64,
//     lastInput: "I'm having issues with the latest update, can you help?",
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: false,
//     buyerIntentLabel: 'Medium',
//   },
//   {
//     sessionId: '2cc11842-94b8-4e2b-9b0e-adc757f034da',
//     companyLogoUrl: 'https://www.pulse.com/assets/images/logo.svg',
//     companyName: 'Pulse',
//     userName: 'Lisa Wang',
//     location: {
//       city: 'Seattle',
//       country: 'United States',
//     },
//     duration: '40',
//     messageCount: 91,
//     lastInput: "What's the process for adding custom domains to our account?",
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: true,
//     buyerIntentLabel: 'Low',
//   },
//   {
//     sessionId: '71b09586-a595-4b8c-97de-327cafa6e16c',
//     companyLogoUrl: 'https://www.nova.com/assets/images/logo.svg',
//     companyName: 'Nova',
//     userName: 'Kevin Brown',
//     location: {
//       city: 'Mumbai',
//       country: 'India',
//     },
//     duration: '12',
//     messageCount: 27,
//     lastInput: 'Can you provide documentation on your webhook implementation?',
//     timePassedAfterInactive: '10',
//     isTyping: false,
//     isActive: false,
//     buyerIntentLabel: 'Medium',
//   },
// ];

// Create provider component
export const ActiveConversationsProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: Uncomment below code for development purposes.
  // const [cards, setCards] = useState<ActiveConversationCard[]>(mockCardsData);
  const [cards, setCards] = useState<ActiveConversationCard[]>([]);

  return (
    <ActiveConversationsContext.Provider
      value={{
        cards,
        setCards,
      }}
    >
      {children}
    </ActiveConversationsContext.Provider>
  );
};
