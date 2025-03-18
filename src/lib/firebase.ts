import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export const firebaseApp = initializeApp({
    credential: cert({
        clientEmail: process.env.client_email,
        privateKey: process.env.private_key,
        projectId: process.env.project_id,
    })
});

export const firestoreApp = getFirestore(firebaseApp);



