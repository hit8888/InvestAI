import { useEffect, useMemo, useState } from 'react';

const useTypeWords = (text: string, speed = 200, isPlaying = true) => {
  const words = useMemo(() => text.split(' '), [text]);
  const [wordIndex, setWordIndex] = useState(0);

  const displayText = useMemo(() => {
    const visibleWords = words.slice(0, wordIndex);
    const hiddenWords = words.slice(wordIndex).map(() => '');
    return [...visibleWords, ...hiddenWords].join(' ');
  }, [words, wordIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    if (wordIndex >= words.length) return;

    // Smoother timing adjustments
    const currentWord = words[wordIndex];
    const wordLength = currentWord.length;
    const baseSpeed = speed;
    // More gradual speed adjustments
    const lengthFactor = Math.min(1 + (wordLength - 5) * 0.1, 1.5);
    const adjustedSpeed = Math.max(baseSpeed * lengthFactor, 150);

    const typingTimeout = setTimeout(() => setWordIndex((i) => i + 1), adjustedSpeed);
    return () => clearTimeout(typingTimeout);
  }, [wordIndex, words, speed, isPlaying]);

  return displayText;
};

export { useTypeWords };
