import { db } from './config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export interface AABPCommitteeMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  linkedin?: string;
  order?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const COMMITTEE_COLLECTION = 'committee';

export const getCommitteeMembers = async (): Promise<AABPCommitteeMember[]> => {
  try {
    const committeeRef = collection(db, COMMITTEE_COLLECTION);
    const q = query(committeeRef, orderBy('order', 'asc'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPCommitteeMember[];
  } catch (error) {
    console.error("Error fetching committee members:", error);
    return [];
  }
};

export const addCommitteeMember = async (member: Omit<AABPCommitteeMember, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COMMITTEE_COLLECTION), {
      ...member,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding committee member:", error);
    throw error;
  }
};

export const updateCommitteeMember = async (id: string, updates: Partial<AABPCommitteeMember>): Promise<void> => {
  try {
    const docRef = doc(db, COMMITTEE_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating committee member:", error);
    throw error;
  }
};

export const deleteCommitteeMember = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COMMITTEE_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting committee member:", error);
    throw error;
  }
};
