type MessageTailProps = {
  role: 'user' | 'ai';
};

const MessageTail = ({ role }: MessageTailProps) => {
  const isUser = role === 'user';

  if (!isUser) return null;

  return (
    <svg
      width="17"
      height="21"
      viewBox="0 0 17 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 fill-card -right-[5px]"
    >
      <path
        d="M16.8876 20.1846C11.6876 20.9846 6.55425 18.1212 4.88758 16.2879C6.60545 12.1914 -4.00033 2.24186 2.99967 2.24148C4.61828 2.24148 6.00073 -1.9986 11.8876 1.1846C11.9088 2.47144 11.8876 6.92582 11.8876 7.6842C11.8876 18.1842 17.8876 19.5813 16.8876 20.1846Z"
        fill="inherit"
      />
    </svg>
  );
};

export default MessageTail;
