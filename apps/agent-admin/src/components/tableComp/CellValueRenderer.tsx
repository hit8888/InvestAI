import BANTAnalysisCellValue from './tableCellComp/BANTAnalysisCellValue';
import BuyerIntentCellValue from './tableCellComp/BuyerIntentCellValue';
import ConversationPreviewCellValue from './tableCellComp/ConversationPreviewCellValue';
import EmailCellValue from './tableCellComp/EmailCellValue';
import CompanyCellValue from './tableCellComp/CompanyCellValue';
import LocationCellValue from './tableCellComp/LocationCellValue';
import MeetingStatusCellValue from './tableCellComp/MeetingStatusCellValue';
import ProductOfInterestCellValue from './tableCellComp/ProductOfInterestCellValue';
import TimestampCellValue from './tableCellComp/TimestampCellValue';
import SessionIDCellValue from './tableCellComp/SessionIDCellValue';
import { LocationWithCityCountry } from '@meaku/core/types/admin/admin';
import UrlCellValue from './tableCellComp/UrlCellValue';
import StatusCellValue from './tableCellComp/StatusCellValue';
import SourceNameCellValue from './tableCellComp/SourceNameCellValue';
import DataSourceTypeCellValue from './tableCellComp/DataSourceTypeCellValue';
import TitleCellValue from './tableCellComp/TitleCellValue';

export type CellValueRendererProps = {
  id: string;
  info: string | LocationWithCityCountry;
};

const cellValueMap: { [key: string]: React.FC<{ value: string }> } = {
  email: EmailCellValue,
  role: ConversationPreviewCellValue,
  company: CompanyCellValue,
  product_of_interest: ProductOfInterestCellValue,
  timestamp: TimestampCellValue, // For Conversations Table
  timeline: TimestampCellValue, // For Leads Table
  // location: LocationCellValue,
  summary: ConversationPreviewCellValue,
  bant_analysis: BANTAnalysisCellValue,
  buyer_intent_score: BuyerIntentCellValue,
  meeting_status: MeetingStatusCellValue,
  // session_id: SessionIDCellValue,
  url: UrlCellValue,
  updated_on: TimestampCellValue,
  status: StatusCellValue,
  source_name: SourceNameCellValue,
  title: TitleCellValue,
  data_source_type: DataSourceTypeCellValue,
  source_url: UrlCellValue,
};

const getCellValueBasedOnId = ({ id, info }: CellValueRendererProps) => {
  if (id === 'country' && typeof info !== 'string') {
    return <LocationCellValue value={info as LocationWithCityCountry} />;
  }
  if (id === 'session_id') {
    return <SessionIDCellValue value={info as string} isTooltipWithClipboard={true} />;
  }
  const Component = cellValueMap[id];
  return Component ? <Component value={info as string} /> : <span>{info as string}</span>;
};

const RenderCell = ({ id, info }: CellValueRendererProps) => {
  return getCellValueBasedOnId({ id, info });
};

export default RenderCell;
