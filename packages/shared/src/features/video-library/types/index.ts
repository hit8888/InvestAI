export interface Video {
  id: string;
  title: string;
  data: string;
  relevant_queries: string[];
  metadata: Record<string, unknown>;
  status: string;
  asset: {
    id: string;
    name: string;
    type: string;
    description: string;
    key: string;
    public_url: string;
  };
}
