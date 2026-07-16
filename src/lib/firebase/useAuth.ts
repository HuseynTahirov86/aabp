"use client";

import { useState, useEffect } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { AABPUser } from "./db-users";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AABPUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Fetch custom user data from Firestore
        const docRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as AABPUser;
          setUserData(data);
          document.cookie = `userRole=${data.role}; path=/; max-age=86400; SameSite=Strict`;
        } else {
          setUserData(null);
          document.cookie = `userRole=; path=/; max-age=0; SameSite=Strict`;
        }
      } else {
        setUserData(null);
        document.cookie = `userRole=; path=/; max-age=0; SameSite=Strict`;
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return { user, userData, loading, logout };
}
