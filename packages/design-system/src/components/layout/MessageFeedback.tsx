import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@breakout/design-system/components/layout/dialog';
import Button from '@breakout/design-system/components/layout/button';
import Textarea from '@breakout/design-system/components/layout/textarea';
import FeedbackButton from '@breakout/design-system/components/layout/feedback-button';
import {
  FeedbackEnum,
  FeedbackRequestPayloadSchema,
  FeedbackRequestPayload,
} from '@meaku/core/types/api/feedback_request';
import { NEGATIVE_FEEDBACK_CATEGORIES, POSITIVE_FEEDBACK_CATEGORIES } from '@meaku/core/constants/feedback';
import useResponseFeedback from '@meaku/core/queries/mutation/useResponseFeedback';
import { trackError } from '@meaku/core/utils/error';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from '@breakout/design-system/components/layout/form';
import { BadgeSelect, BadgeSelectOption } from '@breakout/design-system/components/layout/badge-select';
import MessageSquare from '@breakout/design-system/components/icons/message-square';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import SuccessToastMessage from './SuccessToastMessage';
import toast from 'react-hot-toast';

interface IProps {
  sessionId: string;
  message: WebSocketMessage;
  feedback?: FeedbackRequestPayload;
  onAddFeedback: (feedback: Partial<FeedbackRequestPayload>) => void;
  onRemoveFeedback: () => void;
}

const MessageFeedback = ({ sessionId, message, feedback, onAddFeedback, onRemoveFeedback }: IProps) => {
  const [isFeedbackThumbUp, setIsFeedbackThumbUp] = useState(Boolean(feedback?.positive_feedback === true));
  const [isFeedbackThumbDown, setIsFeedbackThumbDown] = useState(Boolean(feedback?.positive_feedback === false));
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const form = useForm<FeedbackRequestPayload>({
    resolver: zodResolver(FeedbackRequestPayloadSchema),
    defaultValues: {
      category: '',
      remarks: '',
    },
  });

  const { mutateAsync: handlePostResponseFeedback } = useResponseFeedback({
    onError: (error, payload) => {
      trackError(error, {
        action: 'handlePostResponseFeedback',
        sessionId: payload.sessionId,
        component: 'MessageFeedback',
      });

      toast.error('An error occurred while sharing feedback.');
      onRemoveFeedback();
    },
    onSuccess: (_data, { payload: { category } }) => {
      if (category?.length) {
        toast.custom(
          <SuccessToastMessage
            title="Thanks for your feedback!"
            subtitle="We appreciate your input and will use it to improve."
          />,
          {
            position: 'bottom-center',
            duration: 3000,
          },
        );
      }
    },
  });

  const onClickThumbUp = () => {
    setIsFeedbackThumbUp(true);
    setIsFeedbackThumbDown(false);
    setOpenDialog(true);
    handlePrimaryFeedback(FeedbackEnum.THUMBS_UP);
    setCategories(POSITIVE_FEEDBACK_CATEGORIES);
    form.reset();
  };

  const onClickThumbDown = () => {
    setIsFeedbackThumbUp(false);
    setIsFeedbackThumbDown(true);
    setOpenDialog(true);
    handlePrimaryFeedback(FeedbackEnum.THUMBS_DOWN);
    setCategories(NEGATIVE_FEEDBACK_CATEGORIES);
    form.reset();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    form.reset();
  };

  const handleCancelDialog = () => {
    setIsFeedbackThumbUp(false);
    setIsFeedbackThumbDown(false);
    handleCloseDialog();
  };

  const handlePrimaryFeedback = async (feedback: FeedbackEnum) => {
    onAddFeedback({
      positive_feedback: feedback === FeedbackEnum.THUMBS_UP,
    });

    await handlePostResponseFeedback({
      sessionId,
      payload: {
        response_id: message.response_id.toString(),
        positive_feedback: feedback === FeedbackEnum.THUMBS_UP,
      },
    });
  };

  const handleShareDetailedFeedback = async (response: FeedbackRequestPayload) => {
    const positiveFeedbackValue = isFeedbackThumbUp ? true : isFeedbackThumbDown ? false : false;

    onAddFeedback({
      positive_feedback: positiveFeedbackValue,
      category: response.category,
      remarks: response.remarks,
    });

    await handlePostResponseFeedback({
      sessionId,
      payload: {
        response_id: message.response_id.toString(),
        positive_feedback: positiveFeedbackValue,
        category: response.category,
        remarks: response.remarks,
      },
    });
  };

  const showRemarksField = (form.getValues()?.['category'] ?? '').length > 0;
  const isMessageReadOnly =
    Boolean(feedback?.category || feedback?.remarks) || Boolean(categories.length > 0 || form.getValues()?.remarks);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <div className="mt-2 flex items-center gap-2">
        <DialogTrigger asChild>
          <FeedbackButton disabled={isMessageReadOnly} isFilled={isFeedbackThumbUp} onClick={onClickThumbUp} />
        </DialogTrigger>
        <DialogTrigger asChild>
          <FeedbackButton
            disabled={isMessageReadOnly}
            isFilled={isFeedbackThumbDown}
            onClick={onClickThumbDown}
            isInverted={true}
          />
        </DialogTrigger>
      </div>
      <DialogContent className="bg-primary-foreground/80 sm:min-w-[436px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleShareDetailedFeedback)} className="space-y-8">
            <DialogHeader className="flex items-center gap-2">
              <DialogTitle>
                <MessageSquare />
              </DialogTitle>
              <DialogDescription className="text-lg font-medium text-customPrimaryText">
                Please provide more details about your rating
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center">
                  <FormControl>
                    <BadgeSelect>
                      {categories.map((category) => (
                        <BadgeSelectOption key={category} field={field}>
                          {category}
                        </BadgeSelectOption>
                      ))}
                    </BadgeSelect>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showRemarksField ? (
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Please provide your detailed feedback"
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <DialogFooter className="flex w-full !justify-between">
              <Button
                size="sm"
                type="button"
                className="!bg-white font-semibold text-primary"
                onClick={handleCancelDialog}
              >
                Cancel
              </Button>
              <div className="flex">
                <Button
                  size="sm"
                  type="submit"
                  className="border-2 border-secondary-foreground/25 font-semibold"
                  onClick={async (e) => {
                    e.preventDefault();
                    const values = form.getValues();
                    await handleShareDetailedFeedback(values);
                    handleCloseDialog();
                  }}
                >
                  Submit
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFeedback;
