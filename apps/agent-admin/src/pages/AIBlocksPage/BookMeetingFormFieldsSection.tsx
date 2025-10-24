import { useState } from 'react';
import Card from '../../components/AgentManagement/Card';
import Typography from '@breakout/design-system/components/Typography/index';
import Input from '@breakout/design-system/components/layout/input';
import SeparatorLine from './components/SeparatorLine';
import FormFieldTableView from './components/FormFieldTableView';
import FormEnrichedDataSection from './components/FormEnrichedDataSection';

interface BookMeetingFormFieldsSectionProps {
  disabled?: boolean;
  formSubmitCTAName: string;
  handleOnFormSubmitCTANameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MockEnrichedFields = [
  {
    id: '1',
    label: 'Company Domain',
  },
  {
    id: '2',
    label: 'Company Name',
  },
  {
    id: '3',
    label: 'Company HQ State',
  },
  {
    id: '4',
    label: 'Company Country',
  },
  {
    id: '5',
    label: 'Company Linkedin',
  },
  {
    id: '6',
    label: 'Revenue',
  },
  {
    id: '7',
    label: 'Employee Count',
  },
  {
    id: '8',
    label: 'Person Title',
  },
  {
    id: '9',
    label: 'Person Linkedin',
  },
  {
    id: '10',
    label: 'Person Location',
  },
  {
    id: '11',
    label: 'First Name',
  },
  {
    id: '12',
    label: 'Last Name',
  },
  {
    id: '13',
    label: 'Total funding',
  },
  {
    id: '14',
    label: 'Industry',
  },
];

const BookMeetingFormFieldsSection = ({
  disabled,
  formSubmitCTAName,
  handleOnFormSubmitCTANameChange,
}: BookMeetingFormFieldsSectionProps) => {
  const [formName, setFormName] = useState('');

  const handleOnFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value);
  };

  return (
    <Card background="GRAY25" border="GRAY200">
      <Typography variant="label-16-medium">Form</Typography>
      <Input
        required
        value={formName}
        onChange={handleOnFormNameChange}
        placeholder="Name of the form*"
        disabled={disabled}
        className="h-11 w-full rounded-lg border-gray-300 px-3 py-3 text-sm focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
      />
      <Input
        required
        value={formSubmitCTAName}
        onChange={handleOnFormSubmitCTANameChange}
        placeholder="Form Submit CTA*"
        disabled={disabled}
        className="h-11 w-full rounded-lg border-gray-300 px-3 py-3 text-sm focus:border-gray-300 focus:ring-4 focus:ring-gray-200"
      />
      <FormFieldTableView />
      <SeparatorLine />
      <FormEnrichedDataSection
        collapsedRows={2}
        fields={MockEnrichedFields}
        title="Enriched Data"
        description="Automatically enrich the following fields without making your forms longer."
      />
    </Card>
  );
};

export default BookMeetingFormFieldsSection;
