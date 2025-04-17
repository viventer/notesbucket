"use server";

import { adminAuth, adminDB } from "./firebaseAdmin";
import { cookies } from "next/headers";
import { getUserPerms } from "./users";
import { checkRateLimit } from "./rateLimit";
import { redirect } from "next/navigation";
import { UserRole } from "./dbSchemas";

export const checkIfNewUser = async (): Promise<boolean> => {
  const isAllowed = await checkRateLimit();
  if (!isAllowed) {
    redirect("/tooManyRequests");
  }

  const token = await getAuthToken();
  if (!token) {
    throw new Error("Brak tokenu");
  }

  const reqUserId = await getUserIdFromToken(token);
  if (!reqUserId) {
    throw new Error("Niepoprawny token");
  }

  const userDoc = await adminDB.collection("users").doc(reqUserId).get();

  const isNewUser = !userDoc.exists;

  return isNewUser;
};

export async function setAuthToken(token: string) {
  (await cookies()).set("firebaseIdToken", token, {
    httpOnly: true,
    secure: false,
    path: "/",
  });
}

export async function removeAuthToken() {
  (await cookies()).delete("firebaseIdToken");
}

export async function getAuthToken(): Promise<string | null> {
  const allCookies = await cookies();
  const token = allCookies.get("firebaseIdToken")?.value;
  if (!token) {
    return null;
  }
  return token;
}

export const checkIfAuthorized = async (
  authorizedRoles: string[],
  ownerAccess: boolean = false,
  ownerId: string = ""
): Promise<boolean> => {
  const token = await getAuthToken();
  if (!token) {
    await checkRateLimit();
    return false;
  }
  const reqUserId = await getUserIdFromToken(token);
  if (!reqUserId) {
    await checkRateLimit();
    return false;
  }

  if (ownerAccess && reqUserId === ownerId) {
    return true;
  }

  const { role } = await getUserPerms(reqUserId);
  return authorizedRoles.includes(role);
};

export const getUserIdFromToken = async (
  token: string
): Promise<string | null> => {
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (err) {
    console.error(err);
    return null;
  }
  if (!decodedToken?.uid) {
    throw new Error("Niepoprawny token");
  }

  return decodedToken.uid;
};

export const checkIfVerified = async (): Promise<boolean> => {
  const token = await getAuthToken();
  if (!token) {
    return false;
  }
  const reqUserId = await getUserIdFromToken(token);
  if (!reqUserId) {
    return false;
  }

  const { role } = await getUserPerms(reqUserId);
  return role === "verified" || role === "admin";
};

export const getCurrentUserRole = async (): Promise<UserRole> => {
  const token = await getAuthToken();
  console.log(token);
  if (!token) {
    return "unverified";
  }
  const reqUserId = await getUserIdFromToken(token);
  if (!reqUserId) {
    return "unverified";
  }

  const { role } = await getUserPerms(reqUserId);

  return role;
};
