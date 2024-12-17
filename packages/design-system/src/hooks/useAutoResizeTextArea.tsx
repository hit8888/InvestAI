import { useEffect, useRef } from 'react';

type Props = {
  textAreaValue: string;
  initialHeight: number;
  maxHeight: number;
};

const useAutoResizeTextArea = ({ textAreaValue, initialHeight, maxHeight }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${initialHeight}px`;
      const padding = textAreaRef.current.offsetHeight - textAreaRef.current.clientHeight;

      const scrollHeight = textAreaRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight - padding, initialHeight), maxHeight);

      textAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [textAreaValue]);

  return textAreaRef;
};

export default useAutoResizeTextArea;
