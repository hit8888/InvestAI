import { CellContainer } from './CellContainer';

const EmptyCell = () => {
  return (
    <CellContainer className="text-gray-400">
      <span>-</span>
    </CellContainer>
  );
};

export default EmptyCell;
