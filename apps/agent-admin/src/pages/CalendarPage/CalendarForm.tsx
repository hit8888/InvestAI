import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CALENDAR_TYPES, COMMON_TIMEZONES, getBrowserTimezone } from './utils';
import Input from '@breakout/design-system/components/layout/input';
import AgentDropdown from '@breakout/design-system/components/Dropdown/AgentDropdown';
import TextArea from '@breakout/design-system/components/TextArea/index';
import Button from '@breakout/design-system/components/Button/index';
import Typography from '@breakout/design-system/components/Typography/index';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import Label from '@breakout/design-system/components/layout/label';
import { Form, FormControl, FormField, FormItem } from '@breakout/design-system/components/layout/form';
import { CalendarFormData } from '@meaku/core/types/admin/api';

// Validation schema using zod that matches the existing validation logic
const calendarFormSchema = z.object({
  name: z.string().min(1, 'Calendar name is required').trim(),
  calendar_type: z.string().min(1, 'Calendar type is required'),
  calendar_url: z
    .string()
    .min(1, 'Calendar URL is required')
    .refine((url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, 'Calendar URL must be a valid URL'),
  description: z.string().optional(),
  is_primary: z.boolean().optional(),
  timezone: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

type CalendarFormValues = z.infer<typeof calendarFormSchema>;

interface CalendarFormProps {
  initialData?: Partial<CalendarFormData>;
  onSubmit: (data: CalendarFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

const CalendarForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Add Calendar',
}: CalendarFormProps) => {
  // Initialize form with react-hook-form
  const form = useForm<CalendarFormValues>({
    // @ts-ignore - Type instantiation is excessively deep with zodResolver and complex schemas
    resolver: zodResolver(calendarFormSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      calendar_type: initialData?.calendar_type ?? 'CALENDLY',
      calendar_url: initialData?.calendar_url ?? '',
      description: initialData?.description ?? '',
      is_primary: initialData?.is_primary ?? true,
      timezone: initialData?.timezone ?? getBrowserTimezone(),
      metadata: initialData?.metadata ?? {},
    },
  });

  const { handleSubmit, watch, formState } = form;
  const { errors, isDirty } = formState;

  // Watch form values for dropdown defaults
  const watchedCalendarType = watch('calendar_type');
  const watchedTimezone = watch('timezone');

  const defaultCalendarValue = useMemo(() => {
    return CALENDAR_TYPES.find((o) => o.value === watchedCalendarType);
  }, [watchedCalendarType]);

  const defaultTimezoneValue = useMemo(() => {
    return COMMON_TIMEZONES.find((o) => o.value === watchedTimezone || o.label === watchedTimezone);
  }, [watchedTimezone]);

  // Check if form data has changed (using isDirty from react-hook-form)
  const checkIsFormDataValuesChanged = isDirty;

  const onSubmitHandler = (data: CalendarFormValues) => {
    onSubmit(data as CalendarFormData);
  };

  // Collect all form errors for display
  const formErrors = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean) as string[];

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="flex w-full flex-col gap-3">
        {formErrors.length > 0 && (
          <div className="rounded-md bg-destructive-50 p-3">
            <div className="flex flex-col gap-1">
              <Typography variant="body-14" className="text-destructive-1000">
                Please fix the following errors:
              </Typography>
              <ul className="list-disc pl-5">
                {formErrors.map((error, index) => (
                  <li key={index} className="text-destructive-700">
                    <Typography variant="body-14">{error}</Typography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex w-full flex-col gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    id="calendar-form-name-input"
                    autoFocus={true}
                    autoComplete="on"
                    placeholder="Enter calendar name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex w-full items-center gap-2">
            <FormField
              control={form.control}
              name="calendar_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <AgentDropdown
                      id="calendar-form-type-dropdown"
                      options={CALENDAR_TYPES}
                      defaultValue={defaultCalendarValue}
                      allowDeselect={false}
                      onCallback={(value: string | null) => field.onChange(value)}
                      placeholderLabel="Select calendar type"
                      className="h-10 rounded-lg p-2 text-sm"
                      dropdownOpenClassName="ring-2 ring-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <AgentDropdown
                      id="calendar-form-timezone-dropdown"
                      options={COMMON_TIMEZONES}
                      defaultValue={defaultTimezoneValue}
                      allowDeselect={false}
                      onCallback={(value: string | null) => field.onChange(value)}
                      placeholderLabel="Select timezone"
                      className="h-10 rounded-lg p-2 text-sm"
                      dropdownOpenClassName="ring-2 ring-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="calendar_url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input id="calendar-form-url-input" placeholder="https://example.com/calendar" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextArea
                    id="calendar-form-description-textarea"
                    placeholder="Enter calendar description"
                    rows={3}
                    className="rounded-lg focus:ring-2 focus:ring-primary"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_primary"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <span className="flex items-center gap-2">
                    <Checkbox
                      id="calendar-form-primary-checkbox"
                      checked={field.value}
                      className="flex h-4 w-4 items-center justify-center rounded-sm border-gray-400 data-[state=checked]:border-none"
                      onCheckedChange={field.onChange}
                      haveBlackBackground={false}
                    />
                    <Label htmlFor="calendar-form-primary-checkbox" className="text-gray-900">
                      Set as primary calendar
                    </Label>
                  </span>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            id="calendar-form-cancel-button"
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            id="calendar-form-save-button"
            variant="primary"
            type="submit"
            disabled={isSubmitting || !checkIsFormDataValuesChanged}
          >
            {isSubmitting ? 'Saving...' : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CalendarForm;
