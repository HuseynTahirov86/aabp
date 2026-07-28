"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import dynamic from "next/dynamic";
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

const AuthProviderInner = dynamic(() => import("./AuthProviderInner"), {
  ssr: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthContextValue>(defaultAuthContext);
  const handleChange = useCallback((value: AuthContextValue) => setAuthState(value), []);

  return (
    <AuthContext.Provider value={authState}>
      <AuthProviderInner onChange={handleChange} />
      {children}
    </AuthContext.Provider>
  );
}
