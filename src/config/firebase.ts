import * as admin from "firebase-admin";

import service from "./projeto-a3-felipes-firebase-adminsdk-imy6r-9d0f61fabf.json";


admin.initializeApp({
    credential: admin.credential.cert(service as admin.ServiceAccount)
});

export const db = admin.firestore();