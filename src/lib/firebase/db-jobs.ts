import { db } from './config';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export interface AABPJob {
  id?: string;
  title: string;
  company: string;
  location: string;
  type: string; // Full-time, Part-time, Internship, Mentorship
  description: string;
  link: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const JOBS_COLLECTION = 'jobs';

export const getJobs = async (): Promise<AABPJob[]> => {
  try {
    const jobsRef = collection(db, JOBS_COLLECTION);
    const q = query(jobsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPJob[];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const addJob = async (job: Omit<AABPJob, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      ...job,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

export const deleteJob = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
