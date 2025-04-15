import { useState } from 'react';
import { OptionType } from './types';
import { SingleSelectAnswer } from '../DiscoveryAnswer/SingleSelectAnswer';

export const SingleSelectQuestion = ({
  question,
  response_options,
  onSelect,
}: {
  question: string;
  response_options: OptionType[];
  onSelect: (option: OptionType) => void;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState<string | undefined>(undefined);

  const handleSelect = (option: OptionType) => {
    setSubmitted(true);
    setResponse(option.value);
    onSelect(option);
  };

  if (submitted && response) {
    return <SingleSelectAnswer question={question} response={response} />;
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-gray-50 p-5">
      <h3 className="mb-4 text-base font-medium text-gray-800">{question}</h3>

      <div className="space-y-3">
        {response_options.map((option) => (
          <SingleSelectOption key={option.value} option={option} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
};

const SingleSelectOption = ({ option, onSelect }: { option: OptionType; onSelect: (option: OptionType) => void }) => {
  switch (option.type) {
    case 'string':
      return (
        <button
          onClick={() => onSelect(option)}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-left text-sm text-gray-700 transition-all duration-200 hover:border-gray-400 focus:ring-4 focus:ring-gray-300"
        >
          {option.value}
        </button>
      );
    default:
      return null;
  }
};
