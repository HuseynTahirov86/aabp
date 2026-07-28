import { getDb } from './config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp, getDoc, orderBy, increment } from 'firebase/firestore';

export const FORUM_CATEGORIES = [
  'General',
  'Medical Science',
  'Natural Science',
  'Life Science',
  'Social Science',
  'Engineering',
  'Career',
  'Events',
] as const;

export type FirestoreTimestamp = { toDate: () => Date } | string;

export interface ForumTopic {
  id?: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  replyCount: number;
  lastReplyAt?: FirestoreTimestamp;
  createdAt?: FirestoreTimestamp;
}

export interface ForumReply {
  id?: string;
  topicId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt?: FirestoreTimestamp;
}

const TOPICS_COLLECTION = 'forum_topics';
const REPLIES_COLLECTION = 'forum_replies';

export const getTopics = async (category?: string): Promise<ForumTopic[]> => {
  try {
    const topicsRef = collection(getDb(), TOPICS_COLLECTION);
    let q = query(topicsRef, orderBy('lastReplyAt', 'desc'));

    if (category) {
      q = query(topicsRef, where('category', '==', category), orderBy('lastReplyAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ForumTopic[];
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
};

export const getTopic = async (id: string): Promise<{ topic: ForumTopic; replies: ForumReply[] } | null> => {
  try {
    const topicRef = doc(getDb(), TOPICS_COLLECTION, id);
    const topicSnap = await getDoc(topicRef);
    if (!topicSnap.exists()) return null;

    const repliesQ = query(
      collection(getDb(), REPLIES_COLLECTION),
      where('topicId', '==', id),
      orderBy('createdAt', 'asc')
    );
    const repliesSnap = await getDocs(repliesQ);

    return {
      topic: { id: topicSnap.id, ...topicSnap.data() } as ForumTopic,
      replies: repliesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ForumReply[],
    };
  } catch (error) {
    console.error("Error fetching topic:", error);
    return null;
  }
};

export const createTopic = async (data: Omit<ForumTopic, 'id' | 'replyCount' | 'lastReplyAt' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(getDb(), TOPICS_COLLECTION), {
      ...data,
      replyCount: 0,
      lastReplyAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error;
  }
};

export const createReply = async (data: Omit<ForumReply, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(getDb(), REPLIES_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
    });

    const topicRef = doc(getDb(), TOPICS_COLLECTION, data.topicId);
    await updateDoc(topicRef, {
      replyCount: increment(1),
      lastReplyAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
};

export const deleteTopic = async (id: string): Promise<void> => {
  try {
    const repliesQ = query(
      collection(getDb(), REPLIES_COLLECTION),
      where('topicId', '==', id)
    );
    const repliesSnap = await getDocs(repliesQ);
    const deleteReplies = repliesSnap.docs.map(docSnap =>
      deleteDoc(doc(getDb(), REPLIES_COLLECTION, docSnap.id))
    );
    await Promise.all(deleteReplies);

    await deleteDoc(doc(getDb(), TOPICS_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting topic:", error);
    throw error;
  }
};
