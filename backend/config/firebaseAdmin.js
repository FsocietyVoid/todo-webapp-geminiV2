import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

let serviceAccount = null;

if (process.env.SERVICE_ACCOUNT_PATH) {
  const filePath = process.env.SERVICE_ACCOUNT_PATH;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Service account file not found at: ${filePath}`);
  }

  serviceAccount = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

if (!serviceAccount) {
  throw new Error("Missing Firebase Admin credentials. Set SERVICE_ACCOUNT_PATH in .env");
}

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const adminAuth = adminApp.auth();
const adminFirestore = adminApp.firestore();

export { adminApp, adminAuth, adminFirestore };
