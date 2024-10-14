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
        "ui-overflow-hidden ui-transition-all ui-duration-300 ui-ease-in-out",
        {
          "ui-max-h-0": !showFeedbackContainer,
          "ui-max-h-[301px]": showFeedbackContainer,
        },
      )}
    >
      <div className="ui-p-4">
        <div className="ui-rounded-lg ui-border ui-border-gray-300 ui-bg-gray-50 ui-p-4 ui-text-gray-800">
          <div className="ui-flex ui-items-center ui-justify-between">
            <h3 className="ui-text-sm">
              Please provide more details about your rating
            </h3>
            <button onClick={handleCloseFeedbackContainer}>
              <XIcon className="ui-h-4 ui-w-4" />
            </button>
          </div>
          <div>
            {showFeedbackRating && (
              <div className="ui-mt-6">
                <FeedbackRating
                  isReadOnly={isReadOnly}
                  activeRating={activeRating}
                  handleShareRating={handleShareRating}
                />
              </div>
            )}
            {showFeedbackForm && (
              <div className="ui-mt-3">
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
          <div className="ui-mt-6 ui-flex ui-items-center ui-justify-end">
            <Button
              size="sm"
              onClick={handleShareDetailedFeedback}
              disabled={isReadOnly}
              // className="ui-text-sm ui-font-medium"
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
