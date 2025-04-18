import { useState } from 'react';
import { OptionType } from './types';
import CommonDiscoveryAnswer from '../DiscoveryAnswer/CommonDiscoveryAnswer';
import { MultiSelectResponseOption } from './MultiSelectResponseItem';
import Button from '../../Button';
import { DISCOVERY_QUESTION_ANSWER_TYPE } from '@meaku/core/constants/index';

export const MultiSelectQuestion = ({
  question,
  response_options,
  onSubmit,
}: {
  question: string;
  response_options: OptionType[];
  onSubmit: (option: OptionType[]) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<Array<OptionType>>([]);
  const [inputTexts, setInputTexts] = useState<Record<number, OptionType>>({});
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState<string[] | undefined>(undefined);

  const isOptionSelected = (option: OptionType) => {
    return selectedOptions.some((o) => o.value === option.value);
  };

  const handleSelection = (option: OptionType, isSelected: boolean) => {
    if (isSelected) {
      setSelectedOptions((selectedOptions) => [...selectedOptions, option]);
    } else {
      setSelectedOptions((selectedOptions) => selectedOptions.filter((o) => o.value !== option.value));
    }
  };

  const handleTextChange = (text: string, index: number) => {
    const option: OptionType = { type: 'text_box', value: text };
    setInputTexts((texts) => ({ ...texts, [index]: option }));
  };

  const handleSubmit = () => {
    const sortedKeys = Object.keys(inputTexts).sort();
    const sortedValues = sortedKeys.map(Number).map((key) => inputTexts[key]);
    const responses = [...selectedOptions, ...sortedValues];

    setSubmitted(true);
    setResponses(responses.map((res) => res.value as string));
    onSubmit(responses);
  };

  if (submitted && responses && responses.length > 0) {
    return (
      <CommonDiscoveryAnswer
        question={question}
        responses={responses}
        answerType={DISCOVERY_QUESTION_ANSWER_TYPE.MULTI_SELECT}
      />
    );
  }

  const nonEmptyTextBoxes = Object.keys(inputTexts).filter((key) => !!inputTexts[Number(key)].value).length;
  const submitDisabled = selectedOptions.length === 0 && nonEmptyTextBoxes === 0;

  return (
    <div className="w-full max-w-md rounded-lg bg-transparent_gray_3 p-5">
      <h3 className="mb-4 text-base font-medium text-gray-800">{question}</h3>

      <div className="space-y-3">
        {response_options.map((option, index) => (
          <MultiSelectResponseOption
            key={index}
            option={option}
            isSelected={isOptionSelected(option)}
            onSelectionChange={handleSelection}
            inputText={inputTexts[index]?.value ?? ''}
            onTextChange={(text: string) => handleTextChange(text, index)}
          />
        ))}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={submitDisabled} className="px-2.5 py-1.5 text-sm">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
