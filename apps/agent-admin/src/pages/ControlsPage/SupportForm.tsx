import Card from '../../components/AgentManagement/Card';
import { SUPPORT_CONFIG, SupportFormData } from './utils';
import SingleCheckboxAndInputContainer from './SingleCheckboxAndInputContainer';
import Button from '@breakout/design-system/components/Button/index';
import { SaveIcon } from 'lucide-react';
import { Control, FieldErrors } from 'react-hook-form';

type ICheckedFields = {
  email: boolean;
  phone: boolean;
  website_url: boolean;
};

type IProps = {
  control: Control<SupportFormData>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleCheckboxChange: (key: keyof SupportFormData) => void;
  checkedFields: ICheckedFields;
  errors: FieldErrors<SupportFormData>;
  showSubmitButton: boolean;
  isSubmitBtnDisabled: boolean;
};

const SupportForm = ({
  control,
  handleSubmit,
  handleCheckboxChange,
  checkedFields,
  errors,
  showSubmitButton,
  isSubmitBtnDisabled,
}: IProps) => {
  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <Card background={'GRAY25'} border={'GRAY200'}>
        {SUPPORT_CONFIG.map((item) => {
          const fieldKey = item.id as keyof SupportFormData;
          return (
            <SingleCheckboxAndInputContainer
              key={item.id}
              label={item.label}
              id={item.id}
              placeholder={item.placeholder}
              control={control}
              fieldName={fieldKey}
              handleCheckboxChange={() => handleCheckboxChange(fieldKey)}
              checkedValue={checkedFields[fieldKey]}
              error={errors[fieldKey]?.message}
            />
          );
        })}
        {showSubmitButton && (
          <div className="flex w-full justify-end">
            <Button
              type="submit"
              variant="primary"
              buttonStyle="rightIcon"
              rightIcon={<SaveIcon />}
              disabled={isSubmitBtnDisabled}
            >
              Save
            </Button>
          </div>
        )}
      </Card>
    </form>
  );
};

export default SupportForm;
