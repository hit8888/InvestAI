import { z } from 'zod';
import {
  TableDataSchema,
  LeadsTableViewSchema,
  ConversationsTableViewSchema,
  LocationWithCityCountrySchema,
  TransformedProspectAndCompanyDetailsSchema,
  VisitorsTableViewSchema,
} from './admin-table';
import {
  LeadResultSchema,
  PaginationDataSchema,
  ProspectDetailsSchema,
  AdditionalInfoSchema,
  CompanyDetailsSchema,
  LeadsTableResponseSchema,
  ConversationDetailsResponseSchema,
  ConversationFunnelResponseSchema,
  ConversationsResponseResultSchema,
  ConversationsTableResponseSchema,
  SessionDetailsResponseSchema,
  DataSourceWebpagesResponseResultSchema,
  DataSourceWebpagesTableResponseSchema,
  DataSourceDocumentsResponseResultSchema,
  DataSourceDocumentsTableResponseSchema,
  DataSourceOverviewResponseResultSchema,
  DataSourceOverviewSchema,
  DataSourceFeaturesSchema,
  DataSourceArtifactsTableResponseSchema,
  DataSourceArtifactsResponseResultSchema,
  EnrichmentSourceEnum,
  VisitorsResponseResultSchema,
  WebpagesScreenshotsResponseSchema,
  ConversationDetailResponseSchema,
  IcpsResponseSchema,
  VisitorsTableResponseSchema,
  IcpsContactSchema,
  IcpDetailsResponseSchema,
  ProspectDetailsResponseSchema,
} from './api';
import {
  CONVERSATIONS_PAGE,
  DOCUMENTS_PAGE,
  LEADS_PAGE,
  LINK_CLICKS_PAGE,
  SLIDES_PAGE,
  VIDEOS_PAGE,
  VISITORS_PAGE,
  WEBPAGES_PAGE,
} from '../../utils';

export type CONVERSATIONS_PAGE_TYPE = typeof CONVERSATIONS_PAGE;
export type LEADS_PAGE_TYPE = typeof LEADS_PAGE;
export type LINK_CLICKS_PAGE_TYPE = typeof LINK_CLICKS_PAGE;
export type WEBPAGES_PAGE_TYPE = typeof WEBPAGES_PAGE;
export type DOCUMENTS_PAGE_TYPE = typeof DOCUMENTS_PAGE;
export type VIDEOS_PAGE_TYPE = typeof VIDEOS_PAGE;
export type SLIDES_PAGE_TYPE = typeof SLIDES_PAGE;
export type VISITORS_PAGE_TYPE = typeof VISITORS_PAGE;
export type MainPageType = CONVERSATIONS_PAGE_TYPE | LEADS_PAGE_TYPE | LINK_CLICKS_PAGE_TYPE | VISITORS_PAGE_TYPE;

export type PaginationPageType =
  | LEADS_PAGE_TYPE
  | LINK_CLICKS_PAGE_TYPE
  | VISITORS_PAGE_TYPE
  | CONVERSATIONS_PAGE_TYPE
  | WEBPAGES_PAGE_TYPE
  | DOCUMENTS_PAGE_TYPE
  | VIDEOS_PAGE_TYPE
  | SLIDES_PAGE_TYPE;

export type LocationWithCityCountry = z.infer<typeof LocationWithCityCountrySchema>;

export type TableDataResponse = z.infer<typeof TableDataSchema>;

export type LeadsTableViewContent = z.infer<typeof LeadResultSchema>;
export type LeadsTableDisplayContent = z.infer<typeof LeadsTableViewSchema>;

export type VisitorsTableViewContent = z.infer<typeof VisitorsResponseResultSchema>;
export type VisitorsTableDisplayContent = z.infer<typeof VisitorsTableViewSchema>;
export type VisitorsTableResponse = z.infer<typeof VisitorsTableResponseSchema>;

export type ConversationsTableViewContent = z.infer<typeof ConversationsResponseResultSchema>;
export type ConversationsTableDisplayContent = z.infer<typeof ConversationsTableViewSchema>;
export type TransformedProspectAndCompanyDetailsContent = z.infer<typeof TransformedProspectAndCompanyDetailsSchema>;

export type PaginationData = z.infer<typeof PaginationDataSchema>;
export type LeadsTableResponse = z.infer<typeof LeadsTableResponseSchema>;
export type ConversationsTableResponse = z.infer<typeof ConversationsTableResponseSchema>;

export type ConversationsFunnelDataResponse = z.infer<typeof ConversationFunnelResponseSchema>;
export type ConversationDetailsDataResponse = z.infer<typeof ConversationDetailsResponseSchema>;
export type ConversationDetailResponse = z.infer<typeof ConversationDetailResponseSchema>;

export type DataSourceOverviewDataResponse = z.infer<typeof DataSourceOverviewResponseResultSchema>;
export type DataSourceOverviewData = z.infer<typeof DataSourceOverviewSchema>;
export type DataSourceFeaturesData = z.infer<typeof DataSourceFeaturesSchema>;
export type SessionDetailsDataResponse = z.infer<typeof SessionDetailsResponseSchema>;
export type ProspectDetailsResponse = z.infer<typeof ProspectDetailsResponseSchema>;
export type WebpagesScreenshotsDataResponse = z.infer<typeof WebpagesScreenshotsResponseSchema>;

export type EnrichmentSource = z.infer<typeof EnrichmentSourceEnum>;
export type ProspectDetails = z.infer<typeof ProspectDetailsSchema>;
export type CompanyDetails = z.infer<typeof CompanyDetailsSchema>;
export type AdditionalInfoType = z.infer<typeof AdditionalInfoSchema>;

// Agent Configs
export type DataSourceWebpagesResponse = z.infer<typeof DataSourceWebpagesResponseResultSchema>;
export type DataSourceWebpagesTableResponse = z.infer<typeof DataSourceWebpagesTableResponseSchema>;

export type DataSourceDocumentsResponse = z.infer<typeof DataSourceDocumentsResponseResultSchema>;
export type DataSourceDocumentsTableResponse = z.infer<typeof DataSourceDocumentsTableResponseSchema>;

export type DataSourceArtifactsResponse = z.infer<typeof DataSourceArtifactsResponseResultSchema>;
export type DataSourceArtifactsTableResponse = z.infer<typeof DataSourceArtifactsTableResponseSchema>;

export type CommonDataSourceResponse =
  | DataSourceWebpagesResponse
  | DataSourceDocumentsResponse
  | DataSourceArtifactsResponse;

export type CommonDataSourceTableResponse =
  | DataSourceWebpagesTableResponse
  | DataSourceDocumentsTableResponse
  | DataSourceArtifactsTableResponse;

export type IcpsResponse = z.infer<typeof IcpsResponseSchema>;
export type IcpsContact = z.infer<typeof IcpsContactSchema>;
export type IcpDetailsResponse = z.infer<typeof IcpDetailsResponseSchema>;
