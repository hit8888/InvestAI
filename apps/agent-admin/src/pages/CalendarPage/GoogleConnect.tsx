import { Connect } from '@calcom/atoms';

const GoogleConnect = () => {
  const redirectURL = window.location.href;
  return (
    <Connect.GoogleCalendar
      redir={redirectURL}
      className="h-[40px] bg-gradient-to-r from-[#8A2387] via-[#E94057] to-[#F27121] text-center text-base font-semibold transition-all duration-300 hover:bg-orange-700"
    />
  );
};

export default GoogleConnect;
