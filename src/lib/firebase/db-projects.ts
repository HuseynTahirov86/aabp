import { getDb } from './config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

export interface AABPProject {
  id?: string;
  title: string;
  summary: string;
  status: 'Published' | 'Draft';
  imageUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const PROJECTS_COLLECTION = 'projects';

export const getProjects = async (maxLimit?: number): Promise<AABPProject[]> => {
  try {
    const projectsRef = collection(getDb(), PROJECTS_COLLECTION);
    let q = query(projectsRef, orderBy('createdAt', 'desc'));

    if (maxLimit) {
      q = query(q, limit(maxLimit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPProject[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const addProject = async (project: Omit<AABPProject, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(getDb(), PROJECTS_COLLECTION), {
      ...project,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

export const updateProject = async (id: string, updates: Partial<AABPProject>): Promise<void> => {
  try {
    const docRef = doc(getDb(), PROJECTS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const docRef = doc(getDb(), PROJECTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
