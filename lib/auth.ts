"use server";

import { redirect } from "next/navigation";
import { AvailableCategory, UserRole, UserType } from "./dbSchemas";
import { adminAuth, adminDB } from "./firebaseAdmin";
import { cookies } from "next/headers";

export const checkIfNewUser = async (): Promise<boolean> => {
  console.log("checkIfNewUser");
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Niepoprawny token");
  }

  const reqUserId = await getUserIdFromToken(token);
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

export const updateUser = async (userId: string, data: Partial<UserType>) => {
  console.log("updateUser");
  const isAuthorized = await checkIfAuthorized(["admin"], true, userId);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userRef = adminDB.collection("users").doc(userId);
  await userRef.update(data);
};

export const createUser = async (user: UserType) => {
  console.log("createUser");
  const isAuthorized = await checkIfAuthorized(["admin"], true, user.id);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userRef = adminDB.collection("users").doc(user.id);

  const userDoc = await userRef.get();
  if (userDoc.exists) {
    throw new Error("Użytkownik już istnieje");
  }

  await userRef.set(user);
};

export type UserPerms = {
  role: UserRole;
  availableCategories: AvailableCategory[];
};

export const getUserPerms = async (userId: string): Promise<UserPerms> => {
  console.log("getUserPerms");
  const isAuthorized = await checkIfAuthorized(["admin"], true, userId);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userDoc = await adminDB.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("Użytkownik nie istnieje");
  }

  const userData = userDoc.data() as UserType;

  return {
    role: userData.role,
    availableCategories: userData.availableCategories,
  };
};

export const setUserAvailableCategories = async (
  userId: string,
  categories: AvailableCategory[]
) => {
  console.log("setUserAvailableCategories");
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userRef = adminDB.collection("users").doc(userId);
  await userRef.update({ availableCategories: categories });
};

export const setUserRole = async (userId: string, role: UserRole) => {
  console.log("setUserRole");
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userRef = adminDB.collection("users").doc(userId);
  await userRef.update({ role });
};

export type UserName = {
  firstName: string;
  lastName: string;
};

export const getUserName = async (userId: string): Promise<UserName> => {
  console.log("getUserName");
  const isAuthorized = await checkIfAuthorized(["admin"], true, userId);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userDoc = await adminDB.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("Użytkownik nie istnieje");
  }

  const userData = userDoc.data() as UserType;

  return { firstName: userData.firstName, lastName: userData.lastName };
};

export const checkIfAuthorized = async (
  authorizedRoles: string[],
  ownerAccess: boolean = false,
  ownerId: string = ""
): Promise<boolean> => {
  console.log("authorize");
  const token = await getAuthToken();
  if (!token) {
    return false;
  }
  const reqUserId = await getUserIdFromToken(token);
  if (!reqUserId) {
    return false;
  }

  if (ownerAccess && reqUserId === ownerId) {
    return true;
  }

  const { role } = await getUserPerms(reqUserId);
  return authorizedRoles.includes(role);
};

export const getUserIdFromToken = async (token: string): Promise<string> => {
  console.log("getUserIdFromToken");
  const decodedToken = await adminAuth.verifyIdToken(token);
  if (!decodedToken?.uid) {
    throw new Error("Niepoprawny token");
  }

  return decodedToken.uid;
};

export const checkIfVerified = async (): Promise<boolean> => {
  console.log("checkIfVerified");
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
