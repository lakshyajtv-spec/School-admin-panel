import { Client, Databases, Storage, Account } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || "";
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID || "";
const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID || "school-media";

const client = new Client();

if (endpoint && projectId) {
  client.setEndpoint(endpoint).setProject(projectId);
}

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

export const APPWRITE_CONFIG = {
  endpoint,
  projectId,
  databaseId,
  bucketId,
};

/** Checks if Appwrite is properly configured in env variables */
export const isAppwriteReady = (): boolean => {
  return Boolean(projectId && databaseId);
};
