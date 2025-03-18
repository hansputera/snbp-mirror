export type SnbpDocumentData = {
    id: string; // unique identifier from google static snbp
    data: {
        ko: string;
        na: string;
        ni: string;
        pr: string;
        qr: string;
        re: string;
        se: string;
        ac?: {
            pr: string;
            pt: string;
            ur: string;
        };
    };
    fetched_at: number; // when the data is fetched
}
