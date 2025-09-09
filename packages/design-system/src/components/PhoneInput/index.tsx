import { useState } from 'react';
import { cn } from '../../lib/cn';
import { CountryCode } from 'libphonenumber-js';
import PhoneInput from 'react-phone-number-input';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';
import { CountrySelect } from '../layout/CountrySelect';

import 'react-phone-number-input/style.css';
import './styles.css';

type PhoneInputProps = {
  field: ControllerRenderProps<FieldValues, string>;
  phoneLabel: string;
  isArtifactFormFilled: boolean;
  defaultCountry?: CountryCode;
  className?: string;
};

const PhoneInputContainer = ({
  field,
  phoneLabel,
  isArtifactFormFilled,
  defaultCountry = 'US',
  className,
}: PhoneInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    field.onBlur();
    setIsFocused(false);
  };

  return (
    <PhoneInput
      autoComplete="tel"
      defaultCountry={defaultCountry ?? 'US'}
      className={cn([
        'custom-phone-input group w-full rounded-lg border border-gray-300 bg-white text-sm text-customPrimaryText',
        isFocused && 'border-gray-400 ring-0',
        className,
      ])}
      autoCorrect="on"
      spellCheck="true"
      readOnly={isArtifactFormFilled}
      placeholder={phoneLabel}
      countrySelectComponent={CountrySelect}
      onFocus={handleFocus}
      {...field}
      onBlur={handleBlur}
    />
  );
};

export default PhoneInputContainer;
