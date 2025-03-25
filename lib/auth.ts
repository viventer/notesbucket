import { signInWithPopup, User } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, googleAuthProvider } from "./firebase";
import { UserType } from "./dbSchemas";

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
    role: "user",
    availableCategories: [],
    createdAt: new Date(),
  };

  await setDoc(userRef, userData);
};
