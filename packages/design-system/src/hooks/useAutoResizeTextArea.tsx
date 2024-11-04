import { useEffect, useRef } from "react";

type Props = {
  textAreaValue: string;
  initialHeight: number;
  maxHeight: number;
};

const useAutoResizeTextArea = (props: Props) => {
  const {
    textAreaValue: value,
    initialHeight: INITIAL_INPUT_HEIGHT,
    maxHeight: MAX_INPUT_HEIGHT,
  } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${INITIAL_INPUT_HEIGHT}px`;
      const padding =
        textAreaRef.current.offsetHeight - textAreaRef.current.clientHeight;

      const scrollHeight = textAreaRef.current.scrollHeight;
      const newHeight = Math.min(
        Math.max(scrollHeight - padding, INITIAL_INPUT_HEIGHT),
        MAX_INPUT_HEIGHT,
      );

      textAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  return textAreaRef;
};

export default useAutoResizeTextArea;
