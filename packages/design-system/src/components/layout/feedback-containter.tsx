import { DetailedFeedbackPayload } from "@meaku/core/types/feedback";
import { XIcon } from "lucide-react";
import { memo, useState } from "react";
import useAutoResizeTextArea from "../../hooks/useAutoResizeTextArea";
import { cn } from "../../lib/cn";
import Button from "./button";
import FeedbackRating from "./feedback-rating";
import TextArea from "./textarea";

const INITIAL_INPUT_HEIGHT = 40; // px
const MAX_INPUT_HEIGHT = 100; // px

interface IProps {
  showFeedbackContainer?: boolean;
  showFeedbackRating?: boolean;
  showFeedbackForm?: boolean;
  activeRating?: string;
  existingFeedback?: string;
  isReadOnly?: boolean;
  handleCloseFeedbackContainer: () => void;
  handleShareFeedback: (payload: DetailedFeedbackPayload) => void;
}

const FeedbackContainer = (props: IProps) => {
  const {
    showFeedbackContainer,
    showFeedbackRating,
    showFeedbackForm,
    activeRating,
    existingFeedback,
    isReadOnly = false,
    handleCloseFeedbackContainer,
    handleShareFeedback,
  } = props;

  const [inputValue, setInputValue] = useState(existingFeedback ?? "");

  const textAreaRef = useAutoResizeTextArea({
    textAreaValue: inputValue,
    initialHeight: INITIAL_INPUT_HEIGHT,
    maxHeight: MAX_INPUT_HEIGHT,
  });

  const handleShareRating = (rating: string) => {
    handleShareFeedback({ feedbackOption: rating });
  };

  const handleShareDetailedFeedback = () => {
    handleShareFeedback({
      feedbackOption: activeRating,
      feedback: inputValue,
    });
  };

  const handleTextAreaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    const isCtrlOrCmdPressed = e.ctrlKey || e.metaKey;
    const isEnterKeyPressed = e.key === "Enter";

    if (isCtrlOrCmdPressed && isEnterKeyPressed) {
      e.preventDefault();
      handleShareDetailedFeedback();
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        {
          "max-h-0": !showFeedbackContainer,
          "max-h-[301px]": showFeedbackContainer,
        },
      )}
    >
      <div className="p-4">
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm">
              Please provide more details about your rating
            </h3>
            <button onClick={handleCloseFeedbackContainer}>
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <div>
            {showFeedbackRating && (
              <div className="mt-6">
                <FeedbackRating
                  isReadOnly={isReadOnly}
                  activeRating={activeRating}
                  handleShareRating={handleShareRating}
                />
              </div>
            )}
            {showFeedbackForm && (
              <div className="mt-3">
                <TextArea
                  disabled={isReadOnly}
                  ref={textAreaRef}
                  value={inputValue}
                  onKeyDown={handleTextAreaKeyDown}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="We appreciate a more detailed feedback :)"
                />
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center justify-end">
            <Button
              size="sm"
              onClick={handleShareDetailedFeedback}
              disabled={isReadOnly}
              // className="text-sm font-medium"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FeedbackContainer);
