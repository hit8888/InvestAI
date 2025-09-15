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
import AssetCellValue from './tableCellComp/AssetCellValue';
import { DataSourceItem } from '@meaku/core/types/admin/api';
import DescriptionCellValue from './tableCellComp/DescriptionCellValue';
import DurationCellValue from './tableCellComp/DurationCellValue';

type cellValueMapType = {
  [key: string]: React.FC<{ value: string }>;
};

export type CellValueRendererProps = {
  id: string;
  info: string | LocationWithCityCountry | DataSourceItem;
};

const cellValueMap: cellValueMapType = {
  email: EmailCellValue,
  role: ConversationPreviewCellValue,
  company: CompanyCellValue,
  product_of_interest: ProductOfInterestCellValue,
  product_interest: ProductOfInterestCellValue,
  timestamp: TimestampCellValue,
  timeline: TimestampCellValue,
  summary: ConversationPreviewCellValue,
  bant_analysis: BANTAnalysisCellValue,
  meeting_status: MeetingStatusCellValue,
  url: UrlCellValue,
  updated_on: TimestampCellValue,
  status: StatusCellValue,
  title: TitleCellValue,
  data_source_type: DataSourceTypeCellValue,
  source_url: UrlCellValue,
};

type SpecialCellConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  type: string; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
};

const specialCellMap: Record<string, SpecialCellConfig> = {
  country: {
    component: LocationCellValue,
    type: 'LocationWithCityCountry',
    props: { showTooltip: true },
  },
  company_country: {
    component: LocationCellValue,
    type: 'LocationWithCityCountry',
    props: { showTooltip: true },
  },
  session_id: {
    component: SessionIDCellValue,
    type: 'string',
    props: { isTooltipWithClipboard: true },
  },
  asset: {
    component: AssetCellValue,
    type: 'DataSourceItem',
  },
  description: {
    component: DescriptionCellValue,
    type: 'DescriptionValue',
  },
  duration: {
    component: DurationCellValue,
    type: 'string',
  },
  source_name: {
    component: SourceNameCellValue,
    type: 'SourceNameValue',
  },
  buyer_intent_score: {
    component: BuyerIntentCellValue,
    type: 'string',
    props: {
      chipClassName: 'absolute',
    },
  },
  buyer_intent: {
    component: BuyerIntentCellValue,
    type: 'string',
    props: {
      chipClassName: 'absolute',
    },
  },
};

const getCellValueBasedOnId = ({ id, info }: CellValueRendererProps) => {
  // Handle special cases
  const specialCell = specialCellMap[id];
  if (specialCell) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { component: Component, props = {}, type } = specialCell;
    return <Component value={info as typeof type} {...props} />;
  }

  // Handle standard cases
  const Component = cellValueMap[id];
  return Component ? (
    <Component value={info as string} />
  ) : (
    <span title={info as string} className="line-clamp-1">
      {info as string}
    </span>
  );
};

const RenderCell = ({ id, info }: CellValueRendererProps) => {
  if (!info) return <span>-</span>;

  return getCellValueBasedOnId({ id, info });
};

export default RenderCell;
