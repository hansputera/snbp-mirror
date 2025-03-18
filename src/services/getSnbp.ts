import { firestoreApp } from "../lib/firebase"
import ky from "ky";
import { SNBP_URL } from "../const";
import { SnbpDocumentData } from "../types/document";

export const getSnbp = async (id: string): Promise<SnbpDocumentData> => {
    const docs = await firestoreApp.collection('snbp').where('id', '==', id).get();
    const data = docs.docs.at(0)?.data();

    if (!data) {
        const response = await ky.get<Record<string, string>>('./static/'.concat(encodeURIComponent(id)), {
            prefixUrl: SNBP_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        }).json();

        const payload: SnbpDocumentData = {
            id,
            data: response,
            fetched_at: Date.now(),
        };

        await firestoreApp.collection('snbp').add(payload);
        return payload;
    }

    return data as SnbpDocumentData;
}