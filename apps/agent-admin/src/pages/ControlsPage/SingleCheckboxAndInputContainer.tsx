import Label from '@breakout/design-system/components/layout/label';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import Input from '@breakout/design-system/components/layout/input';
import Typography from '@breakout/design-system/components/Typography/index';
import { Control, Controller } from 'react-hook-form';
import { SupportFormData } from './utils';

type IProps = {
  label: string;
  id: string;
  placeholder: string;
  control: Control<SupportFormData>;
  fieldName: keyof SupportFormData;
  handleCheckboxChange: () => void;
  checkedValue: boolean;
  error?: string;
};

const SingleCheckboxAndInputContainer = ({
  label,
  id,
  placeholder,
  control,
  fieldName,
  handleCheckboxChange,
  checkedValue,
  error,
}: IProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <span className="flex items-center gap-2">
        <Checkbox
          className="h-6 w-6"
          haveBlackBackground={false}
          id={id}
          checked={checkedValue}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor={id}>
          {label} {checkedValue && <span className="text-destructive-1000">*</span>}
        </Label>
      </span>
      {checkedValue && (
        <div className="flex flex-col gap-1">
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                className={`w-full ${error ? 'border-destructive-1000' : ''}`}
                placeholder={placeholder}
              />
            )}
          />
          {error && (
            <Typography variant="caption-12-medium" className="text-destructive-1000">
              {error}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleCheckboxAndInputContainer;
