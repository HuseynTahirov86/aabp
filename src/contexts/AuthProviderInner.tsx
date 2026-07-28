"use client";

import { useEffect } from "react";
import { useAuth as useFirebaseAuth } from "@/lib/firebase/useAuth";
import type { AuthContextValue } from "./AuthContext";

interface FirebaseAuthBridgeProps {
  onChange: (value: AuthContextValue) => void;
}

// Rendered client-only via next/dynamic so the Firebase SDK (auth +
// firestore) loads as a separate chunk instead of blocking every page's
// critical-path bundle. Renders nothing — it just pushes auth state up
// to AuthProvider once Firebase has loaded and resolved.
export default function AuthProviderInner({ onChange }: FirebaseAuthBridgeProps) {
  const auth = useFirebaseAuth();

  useEffect(() => {
    onChange(auth);
  }, [auth, onChange]);

  return null;
}
