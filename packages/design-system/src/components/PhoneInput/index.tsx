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
  // TODO: Add default country based on user's IP address or something other logic
  // const getDefaultCountry = (): CountryCode => {
  //   // Get the user's language setting
  //   const language = navigator.language;

  //   // Extract region code from language
  //   const regionCode = language.split('-')[1];

  //   // For English language without region code, default to US
  //   if (language.startsWith('en') && !regionCode) {
  //     return 'US';
  //   }

  //   // Return region code or default to 'US'
  //   return (regionCode ? regionCode.toUpperCase() : 'US') as CountryCode;
  // };

  return (
    <PhoneInput
      defaultCountry={defaultCountry}
      className={cn(
        'custom-phone-input group w-full rounded-lg border border-gray-300 bg-white text-sm text-customPrimaryText',
        {
          'border-gray-400 ring-0 ': isFocused,
        },
        className,
      )}
      readOnly={isArtifactFormFilled}
      placeholder={phoneLabel}
      countrySelectComponent={CountrySelect}
      onFocus={() => setIsFocused(true)}
      {...field}
      onBlur={() => {
        field.onBlur();
        setIsFocused(false);
      }}
    />
  );
};

export default PhoneInputContainer;
