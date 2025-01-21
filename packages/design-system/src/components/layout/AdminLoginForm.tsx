import {
  generateOtpSchema,
  LoginFormValues,
  showOtpSchema,
  showPasswordSchema,
} from '@meaku/core/types/admin/adminLogin';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from './form';
import Input from './input';
import OtpInput from './OtpInput';
import { cn } from '../../lib/cn';
import SpinnerIcon from '../icons/spinner';
import { forwardRef, useImperativeHandle, useMemo } from 'react';

export interface AdminLoginFormRef {
  reset: () => void;
}

type AdminLoginFormProps = {
  handleLogin: (values: LoginFormValues) => void;
  showPasswordField: boolean;
  showOtpField: boolean;
  isLoading: boolean;
  submitBtnLabel: string;
};

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
      resolver: zodResolver(dynamicSchema),
      defaultValues: {
        email: '',
        password: '',
        otp: '',
      },
    });

    useImperativeHandle(ref, () => ({
      reset: () => form.reset(),
    }));

    // Handle errors during submission
    const handleSubmit = form.handleSubmit(
      // Success callback
      (values) => {
        handleLogin(values);
      },
      // Error callback
      (errors) => {
        console.log('Form validation errors:', errors);
        // Get all error messages
        const errorMessages = Object.keys(errors)
          .map((key) => errors[key as keyof typeof errors]?.message)
          .filter(Boolean);

        // Show first error in toast
        if (errorMessages.length > 0) {
          toast.error(errorMessages[0]?.toString() || 'Please check the form for errors');
        }
      },
    );

    return (
      <Form {...form}>
        <form className="flex w-full flex-col gap-6 px-6" onSubmit={handleSubmit}>
          <div className="flex w-full flex-col gap-6 text-left">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col items-start justify-center gap-2 2xl:gap-8">
                  <FormLabel className="text-sm font-bold 2xl:text-6xl">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username@org.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      className="w-full rounded-xl border border-primary py-3 text-lg focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 2xl:py-4 2xl:text-3xl"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {showPasswordField || showOtpField ? (
              <div className={cn('w-full px-1 transition-all duration-300')}>
                {showPasswordField && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem
                        className={cn(
                          'flex w-full transform flex-col items-start justify-center gap-2 transition-all duration-300 ease-in-out 2xl:gap-8',
                          {
                            'translate-y-0 opacity-100': showPasswordField,
                            '-translate-y-full opacity-0': !showPasswordField,
                          },
                        )}
                      >
                        <FormLabel className="text-sm font-bold 2xl:text-6xl">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            className="w-full rounded-xl border border-primary py-3 text-lg focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 2xl:py-4 2xl:text-3xl"
                            {...field}
                          />
                        </FormControl>
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
                        <FormLabel className="text-lg">Enter OTP sent to {form.getValues('email')}</FormLabel>
                        <FormControl>
                          <OtpInput
                            length={6}
                            onOtpSubmit={(otp) => {
                              field.onChange(otp);
                            }}
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
              'flex items-center justify-center gap-1 text-lg font-normal 2xl:text-3xl',
              'rounded-lg bg-primary/80 px-6 py-3 text-white', // Base styles
              'hover:bg-primary', // Hover state
              'focus:ring-primary-300 focus:outline-none focus:ring-4 focus:ring-offset-2', // Focus styles
              {
                'disabled:cursor-not-allowed disabled:bg-primary/30': isLoading,
              }, // Disabled state
            )}
            disabled={isLoading}
            type="submit"
            name="submitButton"
          >
            {isLoading && <SpinnerIcon className="!h-5 !w-5 text-white" />}
            {submitBtnLabel}
          </button>
        </form>
      </Form>
    );
  },
);

export default AdminLoginForm;
