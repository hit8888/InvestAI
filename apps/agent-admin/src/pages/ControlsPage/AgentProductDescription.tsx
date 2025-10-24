import ConfigurationTable from '../../components/ConfigurationTable';
import { CommonControlsProps, ProductDescriptionData } from './utils';
import { useMemo } from 'react';
import useTenantMetadataMutation from '../../queries/mutation/useTenantMetadataMutation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnConfig, ConfigurationData, ConfigurationFormData } from '../../components/ConfigurationTable/utils';
import { productFormSchema, ProductFormData } from './utils';

interface AgentProductDescriptionProps extends CommonControlsProps {
  isLoading: boolean;
  productDescriptions: ProductDescriptionData[];
  error: Error | null;
}

const AgentProductDescription = ({
  title,
  description,
  isLoading,
  productDescriptions,
  error,
}: AgentProductDescriptionProps) => {
  // Mutation hook for updating tenant metadata
  const updateTenantMetadata = useTenantMetadataMutation();

  // React Hook Form setup with Zod resolver
  const form = useForm<ProductFormData>({
    // @ts-ignore - Type instantiation is excessively deep with zodResolver and complex schemas
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      products: [{ name: '', description: '' }],
    },
    mode: 'onChange',
  });

  // Convert ProductDescriptionData[] to ConfigurationData[] for the table
  const data: ConfigurationData[] = useMemo(() => {
    return productDescriptions.map((product) => ({
      name: product.name,
      description: product.description,
    }));
  }, [productDescriptions]);

  // Define columns for the product description table
  const columns: ColumnConfig[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Product Name',
        fieldType: 'input',
        placeholder: 'Add Product Name',
        gridSpan: 4,
      },
      {
        key: 'description',
        label: 'Description',
        fieldType: 'textarea',
        placeholder: 'Add Description',
        gridSpan: 7,
      },
    ],
    [],
  );

  // Handle save with API call
  const handleSave = async (data: ConfigurationData[]) => {
    // Convert ConfigurationData[] back to ProductDescriptionData[]
    const products: ProductDescriptionData[] = data.map((row) => ({
      name: row.name,
      description: row.description,
    }));

    // Call API to save product descriptions
    await updateTenantMetadata.mutateAsync({
      data: {
        products_and_description: products,
      },
    });
  };

  return (
    <ConfigurationTable
      title={title}
      description={description}
      isLoading={isLoading}
      data={data}
      error={error}
      columns={columns}
      onSave={handleSave}
      isDisabled={updateTenantMetadata.isPending}
      form={form as unknown as UseFormReturn<ConfigurationFormData>}
      formFieldName="products"
    />
  );
};

export default AgentProductDescription;
