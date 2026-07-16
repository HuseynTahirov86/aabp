import { db } from './config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';

export interface AABPArticle {
  id?: string;
  title: string;
  content: string;
  summary: string;
  authorId: string;
  authorName?: string;
  imageUrl?: string;
  tags?: string[];
  status: 'Published' | 'Draft';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const ARTICLES_COLLECTION = 'articles';

export const getArticles = async (maxLimit?: number): Promise<AABPArticle[]> => {
  try {
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    let q = query(articlesRef, orderBy('createdAt', 'desc'));

    if (maxLimit) {
      q = query(q, limit(maxLimit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPArticle[];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

export const getArticleById = async (id: string): Promise<AABPArticle | null> => {
  try {
    const { getDoc } = await import('firebase/firestore');
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as AABPArticle;
    }
    return null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

export const addArticle = async (article: Omit<AABPArticle, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), {
      ...article,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding article:", error);
    throw error;
  }
};

export const updateArticle = async (id: string, updates: Partial<AABPArticle>): Promise<void> => {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, ARTICLES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};
