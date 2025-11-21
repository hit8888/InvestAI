import React from 'react';
import Button from '@breakout/design-system/components/Button/index';
import { Save } from 'lucide-react';
import { ICPFieldConfig } from '../utils';

interface IcpFormProps {
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  selectFields: ICPFieldConfig[];
  numberFields: ICPFieldConfig[];
  renderDropdownField: (field: ICPFieldConfig) => React.ReactNode;
  renderNumberField: (field: ICPFieldConfig) => React.ReactNode;
  canSave: boolean;
  isSaving: boolean;
  agentId: number | null;
}

const IcpForm = React.memo(
  ({
    handleSubmit,
    selectFields,
    numberFields,
    renderDropdownField,
    renderNumberField,
    canSave,
    isSaving,
    agentId,
  }: IcpFormProps) => (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
      {/* Render dropdown fields */}
      {selectFields.map(renderDropdownField)}

      {/* Render number fields */}
      {numberFields.map(renderNumberField)}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          id="controls-icp-save-button"
          type="submit"
          variant="system"
          buttonStyle="rightIcon"
          rightIcon={<Save className="h-4 w-4" />}
          disabled={!canSave || !agentId}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  ),
);

IcpForm.displayName = 'IcpForm';

export default IcpForm;
