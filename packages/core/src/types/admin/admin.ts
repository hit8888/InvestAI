import { z } from "zod";
import { 
    ConversationsTableViewSchema,
    LeadsTableViewSchema,
    TableDataSchema, 
} from "./admin-table";
import { 
    ConversationsResponseResultSchema, 
    ConversationsTableResponseSchema, 
    LeadResultSchema, 
    LeadsTableResponseSchema, 
    PaginationDataSchema 
} from "./api";

export type TableDataResponse = z.infer<typeof TableDataSchema>;

export type LeadsTableViewContent = z.infer<typeof LeadResultSchema>;
export type LeadsTableDisplayContent = z.infer<typeof LeadsTableViewSchema>;

export type ConversationsTableViewContent = z.infer<typeof ConversationsResponseResultSchema>;
export type ConversationsTableDisplayContent = z.infer<typeof ConversationsTableViewSchema>;

export type PaginationData = z.infer<typeof PaginationDataSchema>;
export type LeadsTableResponse = z.infer<typeof LeadsTableResponseSchema>;
export type ConversationsTableResponse = z.infer<typeof ConversationsTableResponseSchema>;