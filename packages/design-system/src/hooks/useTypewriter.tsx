import { useEffect, useMemo, useState } from 'react';

const getRandomPlaceholder = (placeholders: string | string[]): string => {
  if (Array.isArray(placeholders)) {
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }
  return placeholders;
};

const useTypewriter = (text: string | string[], speed = 50, repeatDelay = 3000) => {
  const [index, setIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(() => getRandomPlaceholder(text));

  // Use Array.from to properly handle Unicode characters including emojis
  const displayText = useMemo(() => {
    const chars = Array.from(currentPlaceholder);
    return chars.slice(0, index).join('');
  }, [index, currentPlaceholder]);

  useEffect(() => {
    const handleTyping = () => {
      if (index >= currentPlaceholder.length) {
        const resetTimeout = setTimeout(() => {
          setIndex(0);
          setCurrentPlaceholder(getRandomPlaceholder(text));
        }, repeatDelay);
        return () => clearTimeout(resetTimeout);
      }

      const typingTimeout = setTimeout(() => setIndex((i) => i + 1), speed);
      return () => clearTimeout(typingTimeout);
    };

    const cleanup = handleTyping();
    return cleanup;
  }, [index, currentPlaceholder, text, speed, repeatDelay]);

  return displayText;
};

export { useTypewriter };
