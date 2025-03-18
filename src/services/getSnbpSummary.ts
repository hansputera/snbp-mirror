import { firestoreApp } from "@/lib/firebase"
import { SnbpDocumentData } from "@/types/document";
import { SnbpSchoolSummary } from "@/types/snbp";
import { generateCountData } from "@/utils/generateCountData";

export const getSnbpSummary = async (school: string) => {
    const docs = await firestoreApp.collection('snbp').where('data.se', '==', school).get();
    if (docs.empty) {
        return undefined;
    }

    const data = docs.docs.map<SnbpDocumentData>(doc => doc.data() as SnbpDocumentData);
    const accepted = data.filter(doc => doc.data.ac);

    const prodiAndUniv = {
        prodi: accepted.map(acc => acc.data.ac!.pr),
        univ: accepted.map(acc => acc.data.ac!.pt),
    }
    const countProdiAndUniv = generateCountData(prodiAndUniv);

    const countData: SnbpSchoolSummary['count'] = {
        prodi: countProdiAndUniv.prodi,
        universities: countProdiAndUniv.univ,
        accepted: accepted.length,
    }

    return {
        count: countData,
        members: accepted.map(acc => ({
            name: acc.data.na,
            prodi: acc.data.ac?.pr,
            university: acc.data.ac?.pt,
        })),
        schoolName: school.toUpperCase(),
    } as SnbpSchoolSummary;
}