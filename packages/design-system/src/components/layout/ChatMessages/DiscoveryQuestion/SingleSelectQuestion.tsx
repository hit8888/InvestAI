import { useState } from 'react';
import { OptionType } from './types';
import CommonDiscoveryAnswer from '../DiscoveryAnswer/CommonDiscoveryAnswer';
import { DISCOVERY_QUESTION_ANSWER_TYPE } from '@neuraltrade/core/constants/index';
import { ViewType } from '@neuraltrade/core/types/common';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';

type SingleSelectQuestionProps = {
  message: WebSocketMessage;
  question: string;
  response_options: Array<OptionType | Record<string, never>>;
  onSelect: (option: OptionType) => void;
  viewType: ViewType;
};

export const SingleSelectQuestion = ({
  message,
  question,
  response_options,
  onSelect,
  viewType,
}: SingleSelectQuestionProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState<string | undefined>(undefined);

  const handleSelect = (option: OptionType) => {
    setSubmitted(true);
    setResponse(option.value);
    onSelect(option);
  };

  if (submitted && response) {
    return (
      <CommonDiscoveryAnswer
        message={message}
        viewType={viewType}
        question={question}
        responses={[response]}
        answerType={DISCOVERY_QUESTION_ANSWER_TYPE.SINGLE_SELECT}
      />
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-transparent_gray_3 p-5">
      <h3 className="mb-4 text-base font-medium text-gray-800">{question}</h3>

      <div className="space-y-3">
        {(response_options as OptionType[]).map((option: OptionType) => (
          <SingleSelectOption
            key={option.value}
            option={option}
            onSelect={handleSelect}
            disabled={viewType !== ViewType.USER}
          />
        ))}
      </div>
    </div>
  );
};

interface SingleSelectOptionProps {
  option: OptionType;
  disabled?: boolean;
  onSelect: (option: OptionType) => void;
}

const SingleSelectOption = ({ option, disabled, onSelect }: SingleSelectOptionProps) => {
  switch (option.type) {
    case 'string':
      return (
        <label
          className="box-border block flex cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-4 py-[10px] transition-colors hover:border-gray-400 hover:bg-gray-25 focus:ring-4 focus:ring-gray-300"
          onClick={() => onSelect(option)}
        >
          {/* TODO: use radio group from design-system */}
          <input type="radio" className="h-4 w-4 border-gray-400 hover:border-gray-900" disabled={disabled} />
          <span className="ml-3 text-sm font-medium text-customPrimaryText">{option.value}</span>
        </label>
      );
    default:
      return null;
  }
};
