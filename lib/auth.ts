import { signInWithPopup, User } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleAuthProvider } from "./firebase";
import { AvailableCategory, UserRole, UserType } from "./dbSchemas";

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleAuthProvider);
  const user = result.user;

  if (!user) throw new Error("Wystąpił błąd podczas logowania.");

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  const isNewUser = !userDoc.exists();

  return { user, isNewUser };
};

export const updateUser = async (userId: string, data: Partial<UserType>) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

export const createUser = async (user: User) => {
  const userRef = doc(db, "users", user.uid);
  const userData: UserType = {
    id: user.uid,
    firstName: user.displayName?.split(" ")[0] || "",
    lastName: user.displayName?.split(" ")[1] || "",
    email: user.email || "  ",
    role: "unverified",
    availableCategories: [],
    createdAt: new Date(),
  };

  await setDoc(userRef, userData);
};

export type UserPerms = {
  role: UserRole;
  availableCategories: AvailableCategory[];
};

export const getUserPerms = async (userId: string): Promise<UserPerms> => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
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
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { availableCategories: categories });
};

export const setUserRole = async (userId: string, role: UserRole) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { role });
};

export type UserName = {
  firstName: string;
  lastName: string;
};

export const getUserName = async (userId: string): Promise<UserName> => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error("Użytkownik nie istnieje");
  }

  const userData = userDoc.data() as UserType;

  return { firstName: userData.firstName, lastName: userData.lastName };
};
