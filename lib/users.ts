"use server";

import { redirect } from "next/navigation";
import { checkIfAuthorized } from "./auth";
import { AvailableCategory, UserRole, UserType } from "./dbSchemas";
import { adminDB } from "./firebaseAdmin";
import { revalidatePath } from "next/cache";
import { checkRateLimit } from "./rateLimit";

export const updateUser = async (userId: string, data: Partial<UserType>) => {
  const isAllowed = await checkRateLimit();
  if (!isAllowed) {
    redirect("/tooManyRequests");
  }

  console.log("updateUser");
  const isAuthorized = await checkIfAuthorized(["admin"], true, userId);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userRef = adminDB.collection("users").doc(userId);
  await userRef.update(data);

  revalidatePath("/users");
};

export const createUser = async (user: UserType) => {
  const isAllowed = await checkRateLimit();
  if (!isAllowed) {
    redirect("/tooManyRequests");
  }

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

export const getUserEmail = async (userId: string): Promise<string | null> => {
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
  const email = userData.email;

  return email || null;
};

export const setUserAvailableCategories = async (
  userId: string,
  categories: AvailableCategory[]
) => {
  const isAllowed = await checkRateLimit();
  if (!isAllowed) {
    redirect("/tooManyRequests");
  }

  console.log("setUserAvailableCategories");
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userRef = adminDB.collection("users").doc(userId);
  await userRef.update({ availableCategories: categories });

  revalidatePath("/users");
};

export const setUserRole = async (userId: string, role: UserRole) => {
  const isAllowed = await checkRateLimit();
  if (!isAllowed) {
    redirect("/tooManyRequests");
  }

  console.log("setUserRole");
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const userRef = adminDB.collection("users").doc(userId);
  const userData = (await userRef.get()).data() as UserType;
  if (userData.role == "admin") {
    throw new Error(
      "Zmiana roli admina możliwa jest tylko poprzez firebase console."
    );
  }

  await userRef.update({ role });

  revalidatePath("/users");
};

export const getAllUsers = async (): Promise<UserType[]> => {
  const isAllowed = await checkRateLimit();
  if (!isAllowed) {
    redirect("/tooManyRequests");
  }

  console.log("getAllUsers");
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const users = await adminDB.collection("users").get();
  const usersData: UserType[] = users.docs.map((user) => {
    const userData = user.data() as UserType;
    return userData;
  });

  return usersData;
};

export const getUser = async (userId: string): Promise<UserType> => {
  const isAllowed = await checkRateLimit();
  if (!isAllowed) {
    redirect("/tooManyRequests");
  }

  console.log("getUser");
  const isAuthorized = await checkIfAuthorized(["admin"]);
  if (!isAuthorized) {
    redirect("/unauthorized");
  }

  const user = await adminDB.collection("users").doc(userId).get();
  const userData: UserType = user.data() as UserType;

  return userData;
};
