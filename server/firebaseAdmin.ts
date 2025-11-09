import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountBase64 =
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ??
  process.env.GOOGLE_CREDENTIALS_BASE64;

if (!serviceAccountBase64) {
  throw new Error(
    'Missing FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable (Base64 encoded service account JSON).',
  );
}

let serviceAccount: admin.ServiceAccount | undefined;

try {
  const serviceAccountJson = Buffer.from(
    serviceAccountBase64,
    'base64',
  ).toString('utf-8');
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (error) {
  throw new Error(
    'Invalid FIREBASE_SERVICE_ACCOUNT_BASE64 value. Verify the JSON is Base64 encoded correctly.',
  );
}

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('FIREBASE_PROJECT_ID environment variable is not set.');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount!),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export const auth = admin.auth();
export const firestore = admin.firestore();
