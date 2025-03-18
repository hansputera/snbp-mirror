export type SnbpDocumentData = {
    id: string; // unique identifier from google static snbp
    data: Record<string, string>; // data from snbp
    fetched_at: number; // when the data is fetched
}
