import { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@breakout/design-system/components/shadcn-ui/input-otp';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OtpInput = ({otpValue = '', length = 4, onOtpSubmit = (_: string) => {} }) => {
  const [value, setValue] = useState(otpValue ||'');

  const handleOTPSubmit = (value: string) => {
    setValue(value);
    onOtpSubmit(value);
  };

  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={(value) => handleOTPSubmit(value)}
      className="flex justify-center gap-3"
    >
      <InputOTPGroup className="flex gap-2">
        {Array.from({ length }, (_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            className="h-12 w-12 rounded-lg border-2 border-primary/30 text-center 
              text-lg font-medium transition 
              hover:shadow-md focus:border-primary/50 focus:!outline-none focus:ring-2 focus:ring-primary/50"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};

export default OtpInput;
