import {
  generateOtpSchema,
  LoginFormValues,
  showOtpSchema,
  showPasswordSchema,
} from '@meaku/core/types/admin/adminLogin';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from './form';
import Input from './input';
import OtpInput from './OtpInput';
import { cn } from '../../lib/cn';
import SpinnerIcon from '../icons/spinner';
import { forwardRef, useImperativeHandle, useMemo } from 'react';
import { Info } from 'lucide-react';
import Typography from '../Typography';

export interface AdminLoginFormRef {
  reset: () => void;
  resetOTP: () => void;
}

type AdminLoginFormProps = {
  handleLogin: (values: LoginFormValues) => void;
  showPasswordField: boolean;
  showOtpField: boolean;
  isLoading: boolean;
  submitBtnLabel: string;
};

const errorInputClass =
  'border-destructive-1000 bg-destructive-25 focus:border-destructive-1000 focus:ring-destructive-1000/50';
const standardInputClass = 'border-gray-300 bg-white focus:border-gray-300 focus:ring-gray-400';
const baseInputClass =
  'w-full rounded-lg border px-4 py-3 text-sm font-normal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1';

const AdminLoginForm = forwardRef<AdminLoginFormRef, AdminLoginFormProps>(
  ({ handleLogin, showPasswordField, showOtpField, isLoading, submitBtnLabel }, ref) => {
    // Create dynamic schema based on form mode
    const dynamicSchema = useMemo(() => {
      if (showPasswordField) {
        return showPasswordSchema;
      }
      if (showOtpField) {
        return showOtpSchema;
      }
      // Default schema (just email for generateOtp mode)
      return generateOtpSchema;
    }, [showPasswordField, showOtpField]);

    // Replace individual state with form
    const form = useForm<LoginFormValues>({
      // @ts-ignore - Type instantiation is excessively deep with zodResolver and complex schemas
      resolver: zodResolver(dynamicSchema),
      defaultValues: {
        email: '',
        password: '',
        otp: '',
      },
    });

    useImperativeHandle(ref, () => ({
      reset: () => form.reset(),
      resetOTP: () => form.setValue('otp', ''),
    }));

    return (
      <Form {...form}>
        <form className="flex w-full flex-col gap-6" onSubmit={form.handleSubmit(handleLogin)}>
          <div className="flex w-full flex-col gap-6 text-left">
            {!showOtpField && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-start justify-center gap-1">
                    <FormControl>
                      <Input
                        placeholder="Enter your email address *"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        className={cn(
                          baseInputClass,
                          form.formState.errors.email ? errorInputClass : standardInputClass,
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="!mt-0 pl-4 text-xs font-normal text-destructive-1000" />
                  </FormItem>
                )}
              />
            )}

            {showPasswordField || showOtpField ? (
              <div className={cn('w-full transition-all duration-300')}>
                {showPasswordField && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          'flex w-full transform flex-col items-start justify-center gap-1 transition-all duration-300 ease-in-out',
                          {
                            'translate-y-0 opacity-100': showPasswordField,
                            '-translate-y-full opacity-0': !showPasswordField,
                          },
                        )}
                      >
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password *"
                            className={cn(
                              baseInputClass,
                              form.formState.errors.password ? errorInputClass : standardInputClass,
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="!mt-0 pl-4 text-xs font-normal text-destructive-1000" />
                      </FormItem>
                    )}
                  />
                )}
                {showOtpField && (
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          'flex transform flex-col items-center gap-4 transition-all duration-300 ease-in-out',
                        )}
                      >
                        <Typography variant="body-16" textColor="textSecondary" className="text-center">
                          We’ve sent a 6-digit code to:
                          <Typography variant="label-16-medium" textColor="textPrimary">
                            {form.getValues('email')}
                          </Typography>
                          Enter it below to continue.
                        </Typography>
                        <FormControl>
                          <OtpInput
                            length={6}
                            otpValue={field.value}
                            onOtpSubmit={(otp) => {
                              field.onChange(otp);
                            }}
                            slotClassName={cn(
                              'h-[55px] w-[45px] rounded-lg border text-center text-3xl font-semibold transition hover:shadow-md focus:!outline-none focus:ring-2',
                              form.formState.errors.otp
                                ? `${errorInputClass} text-destructive-1000`
                                : 'border-[#DCDAF8] bg-white text-breakout focus:border-breakout focus:ring-breakout/50',
                            )}
                            groupClassName="gap-4"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ) : null}
          </div>
          <button
            className={cn(
              'flex items-center justify-center gap-1 rounded-lg px-4 py-3 text-sm font-semibold text-white', // Base styles: padding, text size, font weight, text color, border radius
              'bg-breakout', // Base background color
              'hover:bg-[#4038C8]', // Hover state background color
              'focus:outline-none focus:ring-2 focus:ring-breakout focus:ring-offset-1', // Focus styles
              {
                'disabled:cursor-not-allowed disabled:bg-breakout/50': isLoading, // Disabled state with 50% opacity background
              },
            )}
            disabled={isLoading}
            type="submit"
            name="submitButton"
          >
            {isLoading && <SpinnerIcon className="!h-5 !w-5 text-white" />}
            {submitBtnLabel}
          </button>

          {showOtpField && (
            <div className="flex w-fit items-center gap-2 self-center rounded-lg border border-warning-300 bg-warning-25 p-2">
              <Info className="text-warning-1000" />
              <Typography variant="label-14-medium" className="text-warning-1000">
                Check your spam folder if you don’t see it.
              </Typography>
            </div>
          )}
        </form>
      </Form>
    );
  },
);

export default AdminLoginForm;
