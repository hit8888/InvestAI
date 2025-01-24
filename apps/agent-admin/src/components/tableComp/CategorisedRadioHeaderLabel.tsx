type IProps = {
  headerLabel: string;
};

const CategorisedRadioHeaderLabel = ({ headerLabel }: IProps) => {
  return (
    <div className="flex items-center justify-center self-stretch bg-gray-50 px-4 py-2">
      <p className="flex-1 text-sm font-medium text-gray-500">{headerLabel}</p>
    </div>
  );
};

export default CategorisedRadioHeaderLabel;
