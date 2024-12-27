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
export type EmailCellValueProps = {
    value: string;
};
export type TimestampCellValueProps = {
    value: string;
};
export type LocationCellValueProps = {
    value: string;
};

// Define the shape of each column
export interface TableHeaderColumn<T> {
    accessor?: string | ((row: T) => string); // This can be a string key or a function
    header: string | (() => React.ReactNode); // Header can be a string or a function that returns a ReactNode
    cell?: (info: { getValue: () => string }) => React.ReactNode; // cell is a function that returns JSX (optional)
    id?: string; // Optional id for the column
}

// Define the type for the row data (can be inferred from your data shape)
export interface LeadsTableRowData {
    email: string;
    name: string;
    company: string;
    role: string;
    productOfInterest: string;
    timestamp: string;
    location: string;
}