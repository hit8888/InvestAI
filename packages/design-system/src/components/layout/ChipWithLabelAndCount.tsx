interface ChipWithLabelAndCountProps {
  label: string;
  count: number;
}

const ChipWithLabelAndCount = ({ label, count }: ChipWithLabelAndCountProps) => {
  const chipLabel = count === 1 ? label : `${label}s`;

  if (count <= 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2.5 rounded-[30px] bg-primary/10 px-3 py-1">
      <div className="h-2 w-2 animate-pulse rounded-full bg-primary/60"></div>
      <span className="text-right text-sm font-medium text-primary/60">{`${count} ${chipLabel}`}</span>
    </div>
  );
};

export default ChipWithLabelAndCount;
