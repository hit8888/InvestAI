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
import Input from '@breakout/design-system/components/layout/input';
import FeedbackButton from '@breakout/design-system/components/layout/feedback-button';
import { Message } from '@meaku/core/types/chat';
import { FeedbackEnum } from '@meaku/core/types/feedback';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from '@breakout/design-system/components/layout/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { BadgeSelect, BadgeSelectOption } from '@breakout/design-system/components/layout/badge-select';
import { NEGATIVE_FEEDBACK_CATEGORIES, POSITIVE_FEEDBACK_CATEGORIES } from '../../../constants/chat.ts';
import MessageSquare from '@breakout/design-system/components/icons/message-square';
import useResponseFeedback from '@meaku/core/queries/mutation/useResponseFeedback';
import toast from 'react-hot-toast';
import { trackError } from '../../../utils/error.ts';
import { useMessageStore } from '../../../stores/useMessageStore.ts';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager.ts';

interface IProps {
  message: Message;
}

const MessageFeedback = (props: IProps) => {
  const { message } = props;

  const [isFeedbackThumbUp, setIsFeedbackThumbUp] = useState(Boolean(message.feedback?.positive_feedback === true));
  const [isFeedbackThumbDown, setIsFeedbackThumbDown] = useState(
    Boolean(message.feedback?.positive_feedback === false),
  );
  const [categories, setCategories] = useState<string[]>([]);
  const isMessageReadOnly =
    (message.isReadOnly ?? false) || message.feedback?.category != null || message.feedback?.remarks != null;

  const responseId = message.id.toString();
  const sessionId = useUnifiedConfigurationResponseManager().getSessionId() ?? '';
  const handleAddMessageFeedback = useMessageStore((state) => state.handleAddMessageFeedback);
  const handleRemoveMessageFeedback = useMessageStore((state) => state.handleRemoveMessageFeedback);

  const formSchema = z.object({
    category: z.string().optional(),
    remarks: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    onSuccess: (_data, { payload: { positive_feedback, remarks } }) => {
      let isCompleteFeedback = false;

      if (positive_feedback && remarks) isCompleteFeedback = true;

      if (isCompleteFeedback) {
        toast.success('Thanks for your feedback!');
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

  const handleShareDetailedFeedback = async (response: z.infer<typeof formSchema>) => {
    const feedback = message.feedback;

    if (!feedback) {
      toast.error('An error occurred while sharing feedback.');
      return;
    }

    handleAddMessageFeedback(responseId, {
      positive_feedback: feedback?.positive_feedback ?? false,
      category: response.category,
      remarks: response.remarks,
    });

    await handlePostResponseFeedback({
      sessionId,
      payload: {
        response_id: responseId,
        positive_feedback: feedback?.positive_feedback ?? false,
        category: response.category,
        remarks: response.remarks,
      },
    });
  };

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
      <DialogContent className="bg-primary-foreground sm:min-w-[700px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleShareDetailedFeedback)} className="space-y-8">
            <DialogHeader className="flex items-center gap-2">
              <DialogTitle>
                <MessageSquare />
              </DialogTitle>
              <DialogDescription className="text-2xl">Please provide more details about your rating</DialogDescription>
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
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Additional Feedback" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  size="sm"
                  type="submit"
                  className="border-2 border-primary/40 bg-transparent !bg-gradient-to-r !from-primary/70 !to-primary/40"
                >
                  Save changes
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
