import { useState } from 'react';
import { cn } from '@meaku/saral';
import { CountryCode } from 'libphonenumber-js';
import PhoneInput, { DefaultInputComponentProps, Props } from 'react-phone-number-input';

import { CountrySelect } from './CountrySelect';

import 'react-phone-number-input/style.css';
import './styles.css';

type PhoneInputProps = Props<DefaultInputComponentProps> & {
  phoneLabel: string;
  isArtifactFormFilled: boolean;
  defaultCountry?: CountryCode;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const PhoneInputContainer = ({
  phoneLabel,
  isArtifactFormFilled,
  defaultCountry = 'US',
  className,
  onBlur,
  ...props
}: PhoneInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
    setIsFocused(false);
  };

  return (
    <PhoneInput
      focusInputOnCountrySelection
      limitMaxLength
      autoComplete="tel"
      defaultCountry={defaultCountry ?? 'US'}
      className={cn([
        'custom-phone-input text-customPrimaryText group w-full rounded-lg border border-gray-300 bg-white text-sm',
        isFocused && 'border-gray-400 ring-0',
        className,
      ])}
      autoCorrect="on"
      spellCheck="true"
      readOnly={isArtifactFormFilled}
      placeholder={phoneLabel}
      countrySelectComponent={CountrySelect}
      onFocus={handleFocus}
      {...props}
      onBlur={handleBlur}
    />
  );
};

export default PhoneInputContainer;
