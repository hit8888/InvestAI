export const POSITIVE_FEEDBACK_CATEGORIES = [
  'Factually Correct',
  'Complete',
  'Nice style',
  'Correct Artifact',
  'Other..',
];
export const NEGATIVE_FEEDBACK_CATEGORIES = [
  'Factually incorrect',
  'Incomplete',
  "Didn't like style",
  'Problem with Source',
  'Other..',
];

export const CDN_URL_FOR_ASSETS = 'https://assets.getbreakout.ai';

export const CHAT_ASSET_DELAY_THRESHOLD_IN_MILLISECONDS = 1000;

// Taken 8 Seconds because the sentence is explicitly matching
// when the audio speaks about the raise hand button.
export const RAISE_HAND_BUTTON_APPEARANCE_THRESHOLD_IN_SECONDS = 6;
