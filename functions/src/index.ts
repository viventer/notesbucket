import { onDocumentWritten } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();
admin.initializeApp();

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

export const revalidatePage = onDocumentWritten(
  "folders/{folderId}",
  async (event) => {
    const response = await fetch(
      `https://localhost:3000/api/revalidate?secret=${REVALIDATION_SECRET}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Rewalidacja nie powiodła się");
    }
    return response.json();
  }
);
