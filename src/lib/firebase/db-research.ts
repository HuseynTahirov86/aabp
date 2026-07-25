import { getDb } from './config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

export interface AABPResearch {
  id?: string;
  title: string;
  abstract: string;
  authors: string[];
  field: string;
  date: string;
  link: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const RESEARCH_COLLECTION = 'research';

export const getResearch = async (maxLimit?: number): Promise<AABPResearch[]> => {
  try {
    const researchRef = collection(getDb(), RESEARCH_COLLECTION);
    let q = query(researchRef, orderBy('createdAt', 'desc'));

    if (maxLimit) {
      q = query(q, limit(maxLimit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPResearch[];
  } catch (error) {
    console.error("Error fetching research:", error);
    return [];
  }
};

export const addResearch = async (research: Omit<AABPResearch, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(getDb(), RESEARCH_COLLECTION), {
      ...research,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding research:", error);
    throw error;
  }
};

export const updateResearch = async (id: string, updates: Partial<AABPResearch>): Promise<void> => {
  try {
    const docRef = doc(getDb(), RESEARCH_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating research:", error);
    throw error;
  }
};

export const deleteResearch = async (id: string): Promise<void> => {
  try {
    const docRef = doc(getDb(), RESEARCH_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting research:", error);
    throw error;
  }
};

export const getResearchById = async (id: string): Promise<AABPResearch | null> => {
  try {
    const { getDoc } = await import('firebase/firestore');
    const docRef = doc(getDb(), RESEARCH_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AABPResearch;
    }
    return null;
  } catch (error) {
    console.error("Error fetching research by id:", error);
    return null;
  }
};
