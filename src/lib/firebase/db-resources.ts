import { getDb } from './config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

export interface Resource {
  id?: string;
  title: string;
  description: string;
  fileUrl: string;
  category: string;
  uploadedBy: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const RESOURCES_COLLECTION = 'resources';

export const getResources = async (category?: string): Promise<Resource[]> => {
  try {
    const resourcesRef = collection(getDb(), RESOURCES_COLLECTION);
    let q = query(resourcesRef, orderBy('createdAt', 'desc'));

    if (category) {
      q = query(resourcesRef, where('category', '==', category), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Resource[];
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};

export const addResource = async (resource: Omit<Resource, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(getDb(), RESOURCES_COLLECTION), {
      ...resource,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding resource:", error);
    throw error;
  }
};

export const deleteResource = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(getDb(), RESOURCES_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting resource:", error);
    throw error;
  }
};
