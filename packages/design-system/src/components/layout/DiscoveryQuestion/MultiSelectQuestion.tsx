import { useState } from 'react';
import { OptionType } from './types';
import { MultiSelectAnswer } from '../DiscoveryAnswer/MultiSelectAnswer';
import { MultiSelectResponseOption } from './MultiSelectResponseItem';
import Button from '../../Button';

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
    return <MultiSelectAnswer question={question} responses={responses} />;
  }

  const nonEmptyTextBoxes = Object.keys(inputTexts).filter((key) => !!inputTexts[Number(key)].value).length;
  const submitDisabled = selectedOptions.length === 0 && nonEmptyTextBoxes === 0;

  return (
    <div className="w-full max-w-md rounded-lg bg-gray-50 p-5">
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
          <Button onClick={handleSubmit} disabled={submitDisabled}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
