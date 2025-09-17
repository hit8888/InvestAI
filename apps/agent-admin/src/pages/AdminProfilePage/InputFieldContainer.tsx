import Typography from '@breakout/design-system/components/Typography/index';
import Card from '../../components/AgentManagement/Card';
import Input from '@breakout/design-system/components/layout/input';
import { InputFieldContainerProps } from './utils';

const InputFieldContainer = ({ name, label, placeholder, value, onChange }: InputFieldContainerProps) => {
  return (
    <Card>
      <div className="flex w-full flex-col items-start gap-2">
        <Typography variant="label-16-medium">{label}</Typography>
        <Input
          name={name}
          className="w-full bg-white px-4 py-3 text-customPrimaryText placeholder:text-gray-400 focus:border-gray-400"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </Card>
  );
};

export default InputFieldContainer;
