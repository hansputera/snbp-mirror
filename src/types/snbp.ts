export type SnbpConfig = {
    authoritative?: string;
    opening_time: number;
    deployment: string;
    key?: string;
    pdf: string;
}

export type SnbpSchoolSummary = {
    schoolName: string;
    members: Array<{
        name: string;
        university?: string;
        prodi?: string;
    }>;
    count: {
        accepted: number;
        universities: Array<{
            name: string;
            count: number;
        }>;
        prodi: Array<{
            name: string;
            count: number;
        }>;
    };
}