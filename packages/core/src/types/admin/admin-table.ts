import { JSX } from 'react';

export type LeadsTableViewProps = {
    email: string;
    name: string;
    role: string;
    company: string;
    location: string;
    timestamp: string;
    productOfInterest: string;
}

// Assuming these are the types for your custom cell components:

export interface CellValueProps {
    value: string;
}

export type ProductOfInterestCellValueProps = CellValueProps;
export type EmailCellValueProps = CellValueProps;
export type TimestampCellValueProps = CellValueProps;
export type LocationCellValueProps = CellValueProps;

export interface CellProps {
    getValue: () => any;
    row: {
      original: any;
    };
  }
  
  export interface ColumnDefinition {
    header: string;
    accessorKey: string;
    id: string;
    cell?: (props: CellProps) => JSX.Element;
  }