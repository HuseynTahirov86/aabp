import { db } from './config';
import { collection, getDocs, getDoc, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';

export interface AABPUser {
  id: string;
  firstName: string;
  lastName: string;
  profession: string;
  institution?: string;
  country?: string;
  bio?: string;
  email: string;
  linkedin?: string;
  phone?: string;
  cvUrl?: string;
  photoUrl?: string;
  role: string;
  publicProfile: boolean;
  createdAt: string;
  avatarUrl?: string;
}

const USERS_COLLECTION = 'users';

export const getPublicUsers = async (): Promise<AABPUser[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(
      usersRef,
      where('publicProfile', '==', true),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPUser[];
  } catch (error) {
    console.error("Error fetching public users:", error);
    return [];
  }
};

export const getPublicUsersCount = async (): Promise<number> => {
  try {
    const { getCountFromServer } = await import('firebase/firestore');
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(
      usersRef,
      where('publicProfile', '==', true)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error fetching public users count:", error);
    return 0;
  }
};

export const getCommitteeUsers = async (): Promise<AABPUser[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(
      usersRef,
      where('role', '==', 'COMMITTEE')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPUser[];
  } catch (error) {
    console.error("Error fetching committee users:", error);
    return [];
  }
};

export const getUserProfile = async (id: string): Promise<AABPUser | null> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as AABPUser;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfile = async (id: string, updates: Partial<AABPUser>): Promise<void> => {
  try {
    const docRef = doc(db, USERS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getTotalUsersCount = async (): Promise<number> => {
  try {
    const { getCountFromServer } = await import('firebase/firestore');
    const coll = collection(db, USERS_COLLECTION);
    const snapshot = await getCountFromServer(coll);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error fetching total users count:", error);
    return 0;
  }
};

export const getAllUsers = async (maxLimit?: number): Promise<AABPUser[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const { limit } = await import('firebase/firestore');
    let q = query(usersRef, orderBy('createdAt', 'desc'));

    if (maxLimit) {
      q = query(q, limit(maxLimit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPUser[];
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
};
