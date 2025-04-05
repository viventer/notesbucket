"use server";

import { AvailableCategory, UserRole, UserType } from "./dbSchemas";
import { adminAuth, adminDB } from "./firebaseAdmin";
import { cookies } from "next/headers";

export const checkIfNewUser = async (userId: string): Promise<boolean> => {
  console.log("checkIfNewUser");
  const userDoc = await adminDB.collection("users").doc(userId).get();

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

export const updateUser = async (
  userId: string,
  data: Partial<UserType>,
  token: string
) => {
  console.log("updateUser");

  const reqUserId = getUserIdFromToken(token);
  const userRef = adminDB.collection("users").doc(userId);
  await userRef.update(data);
};

export const createUser = async (user: UserType) => {
  console.log("createUser");
  const userRef = adminDB.collection("users").doc(user.id);

  await userRef.set(user);
};

export type UserPerms = {
  role: UserRole;
  availableCategories: AvailableCategory[];
};

export const getUserPerms = async (userId: string): Promise<UserPerms> => {
  console.log("getUserPerms");
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
  const userRef = adminDB.collection("users").doc(userId);
  await userRef.update({ availableCategories: categories });
};

export const setUserRole = async (userId: string, role: UserRole) => {
  console.log("setUserRole");
  const userRef = adminDB.collection("users").doc(userId);
  await userRef.update({ role });
};

export type UserName = {
  firstName: string;
  lastName: string;
};

export const getUserName = async (userId: string): Promise<UserName> => {
  console.log("getUserName");
  const userDoc = await adminDB.collection("users").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("Użytkownik nie istnieje");
  }

  const userData = userDoc.data() as UserType;

  return { firstName: userData.firstName, lastName: userData.lastName };
};

export const isAuthorized = async (
  reqUserId: string,
  authorizedRoles: string[]
): Promise<boolean> => {
  console.log("authorize");
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
