interface GenericTableHeaderProps {
  title: string;
}

/**
 * Simple page title header
 */
export const GenericTableHeader = ({ title }: GenericTableHeaderProps) => {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
};
