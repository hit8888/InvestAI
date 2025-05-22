import { z } from 'zod';
import {
  TableDataSchema,
  LeadsTableViewSchema,
  ConversationsTableViewSchema,
  LocationWithCityCountrySchema,
  TransformedProspectAndCompanyDetailsSchema,
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
  ActiveConversationDetailsResponseSchema,
} from './api';
import { CONVERSATIONS_PAGE, LEADS_PAGE } from '../../utils';

export type CONVERSATIONS_PAGE_TYPE = typeof CONVERSATIONS_PAGE;
export type LEADS_PAGE_TYPE = typeof LEADS_PAGE;

export type LocationWithCityCountry = z.infer<typeof LocationWithCityCountrySchema>;

export type TableDataResponse = z.infer<typeof TableDataSchema>;

export type LeadsTableViewContent = z.infer<typeof LeadResultSchema>;
export type LeadsTableDisplayContent = z.infer<typeof LeadsTableViewSchema>;

export type ConversationsTableViewContent = z.infer<typeof ConversationsResponseResultSchema>;
export type ConversationsTableDisplayContent = z.infer<typeof ConversationsTableViewSchema>;
export type TransformedProspectAndCompanyDetailsContent = z.infer<typeof TransformedProspectAndCompanyDetailsSchema>;

export type PaginationData = z.infer<typeof PaginationDataSchema>;
export type LeadsTableResponse = z.infer<typeof LeadsTableResponseSchema>;
export type ConversationsTableResponse = z.infer<typeof ConversationsTableResponseSchema>;

export type ConversationsFunnelDataResponse = z.infer<typeof ConversationFunnelResponseSchema>;
export type ConversationDetailsDataResponse = z.infer<typeof ConversationDetailsResponseSchema>;
export type ActiveConversationDetailsDataResponse = z.infer<typeof ActiveConversationDetailsResponseSchema>;

export type ProspectDetails = z.infer<typeof ProspectDetailsSchema>;
export type CompanyDetails = z.infer<typeof CompanyDetailsSchema>;
export type AdditionalInfoType = z.infer<typeof AdditionalInfoSchema>;
