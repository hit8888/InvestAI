import React from 'react';
import { Info } from 'lucide-react';

import { cn } from '../../lib/cn';
import Button from '../Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from './form';
import Input from './input';
import type { IntegrationForm } from '@neuraltrade/core/types/admin/api';
import TooltipWrapperDark from '../Tooltip/TooltipWrapperDark';

type IntegrationFormProps = {
  formFields: IntegrationForm[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
};

const IntegrationForm: React.FC<IntegrationFormProps> = ({ formFields, isOpen, onClose, onSubmit }) => {
  const form = useForm<Record<string, string>>({
    defaultValues: formFields.reduce(
      (acc, field) => {
        acc[field.key] = '';
        return acc;
      },
      {} as Record<string, string>,
    ),
    mode: 'onChange',
  });

  const { handleSubmit, control } = form;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-[420px] max-w-none flex-col gap-6 rounded-2xl bg-white p-4">
        <DialogHeader className="items-center space-y-1 p-0 text-center">
          <DialogTitle className="text-2xl font-semibold text-gray-900">Complete Integration Setup</DialogTitle>
          <DialogDescription className="text-center text-base text-gray-500">
            To continue, we need a few details to properly configure this integration for your workspace.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formFields.map((formField) => (
              <FormField
                control={control}
                name={formField.key}
                key={formField.key}
                rules={{
                  required: `${formField.label} is required`,
                }}
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-center space-x-1 pl-4 pr-1">
                      <FormLabel className="flex-1 text-xs font-medium text-gray-500">{formField.label}</FormLabel>
                      {formField.description && (
                        <TooltipWrapperDark
                          showTooltip
                          showArrow={false}
                          tooltipSide="right"
                          trigger={<Info className="h-4 w-4 text-breakout" />}
                          content={formField.description}
                        />
                      )}
                    </div>
                    <FormControl>
                      <Input
                        className={cn('h-auto rounded-lg border px-4 py-3 text-sm placeholder-gray-400', {
                          'border-destructive-1000 bg-destructive-25 focus:border-destructive-1000 focus:ring-destructive-1000/50':
                            form.formState.errors[formField.key],
                          'border-gray-300 bg-white focus:border-gray-300 focus:ring-gray-400':
                            !form.formState.errors[formField.key],
                        })}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value?.trim())}
                      />
                    </FormControl>
                    <FormMessage className="pl-4 text-xs font-normal text-destructive-1000" />
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter className="!mt-6 !justify-end p-0">
              <Button
                type="submit"
                variant="system"
                size="medium"
                className="px-4 py-3 disabled:bg-gray-300"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                Continue
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IntegrationForm;
