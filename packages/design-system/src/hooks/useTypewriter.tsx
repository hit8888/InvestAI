import { useEffect, useMemo, useState } from 'react';

const useTypewriter = (text: string, speed = 50, repeatDelay = 3000) => {
  const [index, setIndex] = useState(0);
  const displayText = useMemo(() => text.slice(0, index), [index, text]);

  useEffect(() => {
    const handleTyping = () => {
      if (index >= text.length) {
        const resetTimeout = setTimeout(() => setIndex(0), repeatDelay);
        return () => clearTimeout(resetTimeout);
      }

      const typingTimeout = setTimeout(() => setIndex((i) => i + 1), speed);
      return () => clearTimeout(typingTimeout);
    };

    const cleanup = handleTyping();
    return cleanup;
  }, [index, text, speed, repeatDelay]);

  return displayText;
};

export { useTypewriter };
