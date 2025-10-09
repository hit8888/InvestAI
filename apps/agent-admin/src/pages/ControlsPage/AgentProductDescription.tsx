import ProductDescriptionTable from './ProductDescriptionTable';
import PromptHeader from './PromptHeader';
import FilledProductDescriptionData from './FilledProductDescriptionData';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import LoadingState from './LoadingState';
import {
  CommonControlsProps,
  ProductDescriptionData,
  ProductFormData,
  PRODUCT_DESCRIPTION_INITIAL_DATA,
  productFormSchema,
} from './utils';
import { useEffect, useMemo, useState } from 'react';
import useTenantMetadataMutation from '../../queries/mutation/useTenantMetadataMutation';
import { toast } from 'react-hot-toast';
import { deepCompare } from '@meaku/core/utils/index';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
  const [clickOnEdit, setClickOnEdit] = useState(false);
  const [savedProductData, setSavedProductData] = useState<ProductDescriptionData[]>([]);

  // Mutation hook for updating tenant metadata
  const updateTenantMetadata = useTenantMetadataMutation();

  // React Hook Form setup with Zod resolver
  const form = useForm<ProductFormData>({
    // @ts-ignore - Type instantiation is excessively deep with zodResolver and complex schemas
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      products: PRODUCT_DESCRIPTION_INITIAL_DATA,
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const getFilledProducts = (productDescriptions: ProductDescriptionData[]) => {
    return productDescriptions.filter((product) => product.name.trim() && product.description.trim());
  };

  // Initialize form data when product data are loaded
  useEffect(() => {
    const filledProducts = getFilledProducts(productDescriptions);

    if (filledProducts.length > 0) {
      const newFormData = { products: filledProducts };
      reset(newFormData);
      setSavedProductData(filledProducts);
    } else {
      // Reset with initial empty data if no valid products are found
      reset({ products: PRODUCT_DESCRIPTION_INITIAL_DATA });
      setSavedProductData([]);
    }
  }, [productDescriptions, reset]);

  const onSubmit = async (data: ProductFormData) => {
    // Filter out empty products (only include products with both name and description)
    const validProducts = data.products.filter((product) => product.name.trim() && product.description.trim());

    // Compare with saved data
    if (deepCompare(validProducts, savedProductData)) {
      setClickOnEdit(false);
      return;
    }

    try {
      // Call API to save product descriptions
      await updateTenantMetadata.mutateAsync({
        data: {
          products_and_description: validProducts,
        },
      });

      // Update saved data and form default values
      const newSavedData = validProducts.length > 0 ? validProducts : [];
      setSavedProductData(newSavedData);

      // Reset form with new defaults to update form's defaultValues
      const newFormData = { products: newSavedData.length > 0 ? newSavedData : PRODUCT_DESCRIPTION_INITIAL_DATA };
      reset(newFormData);

      setClickOnEdit(false);
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    }
  };

  const handleEdit = () => {
    setClickOnEdit(true);
    // Reset form to its saved state (defaultValues)
    reset();
  };

  const originalValuesAllFilled = useMemo(
    () =>
      savedProductData.length > 0 &&
      savedProductData.every((product) => product.name.trim() !== '' && product.description.trim() !== ''),
    [savedProductData],
  );

  const showOriginalProductData = !clickOnEdit && originalValuesAllFilled;

  if (isLoading) {
    return <LoadingState title={title} description={description} />;
  }

  if (error) {
    return <ErrorState />;
  }

  const filledProducts = getFilledProducts(savedProductData);

  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      {showOriginalProductData ? (
        <FilledProductDescriptionData productDescriptions={filledProducts} handleEdit={handleEdit} />
      ) : (
        <ProductDescriptionTable
          isLoading={isLoading}
          columns={['Product Name', 'Description', '']}
          control={control}
          errors={errors}
          onSubmit={handleSubmit(onSubmit)}
          isBtnDisabled={updateTenantMetadata.isPending}
        />
      )}
    </div>
  );
};

export default AgentProductDescription;
