import {
  Dialog,
  DialogClose,
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
import { Message } from '@meaku/core/types/agent';
import { FeedbackEnum, feedbackFormSchema, FeedbackFormSchemaType } from '@meaku/core/types/feedback';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from '@breakout/design-system/components/layout/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { BadgeSelect, BadgeSelectOption } from '@breakout/design-system/components/layout/badge-select';
import { NEGATIVE_FEEDBACK_CATEGORIES, POSITIVE_FEEDBACK_CATEGORIES } from '@meaku/core/constants/feedback';
import MessageSquare from '@breakout/design-system/components/icons/message-square';
import useResponseFeedback from '@meaku/core/queries/mutation/useResponseFeedback';
import toast from 'react-hot-toast';
import { trackError } from '@meaku/core/utils/error';
import { Feedback } from '@meaku/core/types/session';
import SuccessToastMessage from './SuccessToastMessage';

interface IProps {
  message: Message;
  sessionId: string;
  handleAddMessageFeedback: (messageId: string, feedback: Partial<Feedback>) => void;
  handleRemoveMessageFeedback: (messageId: string, previousState?: Message) => void;
}

const MessageFeedback = (props: IProps) => {
  const { message, sessionId, handleAddMessageFeedback, handleRemoveMessageFeedback } = props;

  const [isFeedbackThumbUp, setIsFeedbackThumbUp] = useState(Boolean(message.feedback?.positive_feedback === true));
  const [isFeedbackThumbDown, setIsFeedbackThumbDown] = useState(
    Boolean(message.feedback?.positive_feedback === false),
  );
  const [categories, setCategories] = useState<string[]>([]);
  const isMessageReadOnly =
    (message.isReadOnly ?? false) || message.feedback?.category != null || message.feedback?.remarks != null;

  const responseId = message.id.toString();

  const form = useForm<FeedbackFormSchemaType>({
    resolver: zodResolver(feedbackFormSchema),
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
      handleRemoveMessageFeedback(payload.payload.response_id);
    },
    onSuccess: (_data, { payload: { category } }) => {
      if(category?.length) {
        toast.custom(
        <SuccessToastMessage 
        title='Thanks for your feedback!' 
        subtitle='We appreciate your input and will use it to improve.'/>, 
        {
          position: 'bottom-center',
          duration: 3000,
        });
      }
    },
  });

  const onClickThumbUp = () => {
    setIsFeedbackThumbUp(true);
    setIsFeedbackThumbDown(false);
    handlePrimaryFeedback(FeedbackEnum.THUMBS_UP);
    setCategories(POSITIVE_FEEDBACK_CATEGORIES);
    form.reset();
  };

  const onClickThumbDown = () => {
    setIsFeedbackThumbUp(false);
    setIsFeedbackThumbDown(true);
    handlePrimaryFeedback(FeedbackEnum.THUMBS_DOWN);
    setCategories(NEGATIVE_FEEDBACK_CATEGORIES);
    form.reset();
  };

  const handlePrimaryFeedback = async (feedback: FeedbackEnum) => {
    handleAddMessageFeedback(responseId, {
      positive_feedback: feedback === FeedbackEnum.THUMBS_UP,
    });

    await handlePostResponseFeedback({
      sessionId,
      payload: {
        response_id: message.id.toString(),
        positive_feedback: feedback === FeedbackEnum.THUMBS_UP,
      },
    });
  };

  const handleShareDetailedFeedback = async (response: FeedbackFormSchemaType) => {
    const positiveFeedbackValue = isFeedbackThumbUp ? true: isFeedbackThumbDown ? false : false;

    handleAddMessageFeedback(responseId, {
      positive_feedback: positiveFeedbackValue,
      category: response.category,
      remarks: response.remarks,
    });

    await handlePostResponseFeedback({
      sessionId,
      payload: {
        response_id: responseId,
        positive_feedback: positiveFeedbackValue,
        category: response.category,
        remarks: response.remarks,
      },
    });
  };

  const showRemarksField = (form.getValues()?.['category'] ?? '').length > 0;

  return (
    <Dialog>
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
              <DialogDescription className="text-lg font-medium text-gray-900">
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
            {showRemarksField ? <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} placeholder="Please provide your detailed feedback" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> : null}
            <DialogFooter className='w-full flex !justify-between'>
              <DialogClose asChild>
                <Button
                  size="sm"
                  type="button"
                  className="!bg-white text-primary font-semibold"
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  size="sm"
                  type="submit"
                  className="border-2 border-secondary-foreground/25 font-semibold"
                >
                  Submit
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFeedback;
