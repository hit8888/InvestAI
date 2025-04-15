export interface OptionType {
  type: 'string' | 'text_box';
  value?: string;
  placeholder?: string;
}

export interface EventData {
  question: string;
  responses: OptionType[];
}
