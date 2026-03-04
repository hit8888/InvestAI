import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from '../../../components/AgentManagement/Card';
import CardTitleAndDescription from '../../../components/AgentManagement/CardTitleAndDescription';
import Button from '@breakout/design-system/components/Button/index';
import { deepCompare } from '@neuraltrade/core/utils/index';
import { AskAICallToActionsSectionProps, CTAData, isValidCTA } from '../utils/blockHelpers';
import AskAICTAItem from './AskAICTAItem';
import InfoCard from '../../../components/AgentManagement/InfoCard';
import { cn } from '@breakout/design-system/lib/cn';

// Main Component
const AskAICallToActionsSection: React.FC<AskAICallToActionsSectionProps> = ({
  initialData,
  onChange,
  isLoading = false,
  disabled = false,
}) => {
  // Local state for editing (not saved until Save button is clicked)
  const [data, setData] = useState<CTAData[]>([]);

  // Track if save operation is in progress
  const [isSaving, setIsSaving] = useState(false);

  // Generate unique ID for new CTAs
  const generateCTAId = useCallback(() => {
    return `cta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Add new CTA (only updates local state)
  const handleAddCTA = useCallback(() => {
    const newCTA: CTAData = {
      id: generateCTAId(),
      icon: '',
      name: '',
      action: '',
    };
    setData((prev) => [...prev, newCTA]);
  }, [generateCTAId]);

  // Sync state with initialData prop changes
  useEffect(() => {
    if (initialData?.length && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  // Validate all CTAs
  const areAllCTAsValid = useMemo(() => {
    if (data.length === 0) return true; // Empty is valid
    return data.every((cta) => isValidCTA(cta));
  }, [data]);

  // Check if there are any CTAs with filled data (to control Add button)
  const hasIncompleteCTAs = useMemo(() => {
    return data.some((cta) => !isValidCTA(cta));
  }, [data]);

  // Update specific CTA (only updates local state)
  const handleCTAUpdate = useCallback((id: string, updates: Partial<CTAData>) => {
    setData((prev) => prev.map((cta) => (cta.id === id ? { ...cta, ...updates } : cta)));
  }, []);

  // Delete CTA (only updates local state)
  const handleCTADelete = useCallback((id: string) => {
    setData((prev) => prev.filter((cta) => cta.id !== id));
  }, []);

  // Save handler - validates and calls onChange
  const handleSave = useCallback(async () => {
    if (!areAllCTAsValid) {
      return;
    }

    if (deepCompare(data, initialData)) {
      return;
    }

    setIsSaving(true);
    try {
      // Call the onChange callback with validated data
      await onChange?.(data);
    } finally {
      setIsSaving(false);
    }
  }, [areAllCTAsValid, data, onChange]);

  const isDisabled = disabled || isLoading || isSaving;
  const isAddCTADisabled = isDisabled || hasIncompleteCTAs;
  const isSaveDisabled = isDisabled || !areAllCTAsValid || deepCompare(data, initialData);

  return (
    <Card background="GRAY25" border="GRAY200">
      <CardTitleAndDescription title="Call to Actions" description="Configure the CTAs in the agent window" />
      {data.length === 0 && <InfoCard title="CTAs" description="Add CTAs to the agent window" />}
      <div className="flex w-full flex-col gap-6">
        {/* CTA Items */}
        {data.map((cta, index) => (
          <AskAICTAItem
            key={cta.id}
            cta={cta}
            index={index}
            onUpdate={handleCTAUpdate}
            onDelete={handleCTADelete}
            disabled={isDisabled}
          />
        ))}

        <div
          className={cn('flex w-full items-center justify-between gap-4', {
            'justify-end': data.length === 0,
          })}
        >
          {/* Add CTA Button */}
          <Button onClick={handleAddCTA} disabled={isAddCTADisabled} variant="system">
            Add CTA
          </Button>

          {/* Save Button */}
          {data.length > 0 && (
            <Button onClick={handleSave} disabled={isSaveDisabled} variant="primary" className="px-6">
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AskAICallToActionsSection;
