"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
  useMemo,
} from "react";
import { auth } from "@/lib/firebase";
import { onIdTokenChanged } from "firebase/auth";
import { getCurrentUserRole, setAuthToken } from "@/lib/auth";
import { UserRole } from "@/lib/dbSchemas";

interface UserContextValue {
  role: UserRole;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [role, setRole] = useState<UserRole>("unverified");

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        await setAuthToken(token);

        try {
          const value = await getCurrentUserRole();
          if (value && value !== role) {
            setRole(value);
          }
        } catch (err) {
          console.log("Użytkownik nie został jeszcze utworzony");
        }
      } else {
        await setAuthToken("");
      }
    });

    return unsubscribe;
  }, [role]);

  const contextValue = useMemo(() => ({ role }), [role]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser musi być używany wewnątrz UserProvider");
  }
  return context;
};
