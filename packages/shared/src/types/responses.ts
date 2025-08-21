import type { Message } from './message';

export interface InitSessionResponse {
  agent_id: string;
  chat_history: Message[];
  feedback: string[];
  prospect_id: string;
  session_id: string;
}

export type FormField = {
  label: string;
  field_name: string;
  data_type: string;
  is_required: boolean;
  options: string[] | null;
};

type QualificationSelectOption = {
  type: string;
  value: string | null;
  placeholder: string | null;
};

export type QualificationQuestion = {
  id: string | null;
  answer_type: string;
  question: string;
  response_options: QualificationSelectOption[];
  is_required: boolean;
};

export interface FormConfigResponse {
  agent_id: number;
  prospect_id: string | null;
  form_config: {
    form_data: {
      default_message: string | null;
      form_fields: FormField[];
      qualification: boolean;
      function: string;
    };
    default_data: Record<string, string>;
    qualification: boolean;
    qualification_questions: QualificationQuestion[];
  };
}
