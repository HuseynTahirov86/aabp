"use client";

import React, { createContext, useContext } from "react";
import { useAuth as useFirebaseAuth } from "@/lib/firebase/useAuth";
import type { User } from "firebase/auth";
import type { AABPUser } from "@/lib/firebase/db-users";

export interface AuthContextValue {
  user: User | null;
  userData: AABPUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextValue = {
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
};

const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
