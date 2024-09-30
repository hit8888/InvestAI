export enum FeedbackEnum {
  THUMBS_UP = "thumbs_up",
  THUMBS_DOWN = "thumbs_down",
}

export type Feedback = {
  responseId: string;
  feedback: FeedbackEnum;
};

export type InitialFeedbackPayload = {
  responseId: string;
  feedbackType: FeedbackEnum;
};

export type DetailedFeedbackPayload = {
  feedbackOption?: string;
  feedback?: string;
};
