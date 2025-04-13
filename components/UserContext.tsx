"use client";

import { createContext, useContext, ReactNode } from "react";

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

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser musi być używany wewnątrz UserProvider");
  }
  return context;
};
