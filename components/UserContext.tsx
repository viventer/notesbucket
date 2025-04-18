"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onIdTokenChanged } from "firebase/auth";
import { setAuthToken } from "@/lib/auth";

interface UserContextValue {
  role: string;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  role: string;
}

export const UserProvider = ({ children, role }: UserProviderProps) => {
  const value = { role };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        console.log("teraz");
        const token = await user.getIdToken();
        await setAuthToken(token);
      } else {
        await setAuthToken("");
      }
    });

    return unsubscribe;
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser musi być używany wewnątrz UserProvider");
  }
  return context;
};
