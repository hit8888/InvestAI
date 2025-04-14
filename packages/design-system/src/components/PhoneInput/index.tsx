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
};

const PhoneInputContainer = ({ field, phoneLabel, isArtifactFormFilled }: PhoneInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const getDefaultCountry = (): CountryCode => {
    // Get the user's language setting
    const language = navigator.language; // Get the user's language setting

    // Extract region code from language
    const regionCode = language.split('-')[1];

    // Return region code or default to 'US'
    return (regionCode ? regionCode.toUpperCase() : 'US') as CountryCode;
  };

  return (
    <PhoneInput
      defaultCountry={getDefaultCountry()}
      className={cn('custom-phone-input group w-full rounded-lg border border-gray-300 bg-white text-sm ', {
        'border-gray-400 ring-0 ': isFocused,
      })}
      readOnly={isArtifactFormFilled}
      placeholder={phoneLabel}
      countrySelectComponent={CountrySelect}
      onFocus={() => setIsFocused(true)}
      {...field}
      onBlur={() => setIsFocused(false)}
    />
  );
};

export default PhoneInputContainer;
