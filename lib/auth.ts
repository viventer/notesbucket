"use server";

import { AvailableCategory, UserRole, UserType } from "./dbSchemas";
import { adminApp, adminAuth, adminDB } from "./firebaseAdmin";

export const checkIfNewUser = async (userId: string): Promise<boolean> => {
  console.log("checkIfNewUser");
  const userDoc = await adminDB.collection("users").doc(userId).get();

  const isNewUser = !userDoc.exists;

  return isNewUser;
};

export const updateUser = async (userId: string, data: Partial<UserType>) => {
  console.log("updateUser");
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

export const verifyToken = async (token: string): Promise<string> => {
  console.log("verifyToken");
  const decodedToken = await adminAuth.verifyIdToken(token);

  if (!decodedToken) {
    throw new Error("Niepoprawny token.");
  }

  return decodedToken.uid;
};
