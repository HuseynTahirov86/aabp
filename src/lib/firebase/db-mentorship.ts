import { getDb } from './config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp, getDoc, orderBy } from 'firebase/firestore';

export interface MentorshipProfile {
  id?: string;
  userId: string;
  type: 'mentor' | 'mentee';
  expertise: string[];
  bio: string;
  available: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

export interface Mentorship {
  id?: string;
  mentorId: string;
  menteeId: string;
  mentorName?: string;
  menteeName?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'ended';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const PROFILES_COLLECTION = 'mentorship_profiles';
const MENTORSHIPS_COLLECTION = 'mentorships';

export const createMentorshipProfile = async (userId: string, data: Omit<MentorshipProfile, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
  const existingQuery = query(
    collection(getDb(), PROFILES_COLLECTION),
    where('userId', '==', userId)
  );
  const existingSnapshot = await getDocs(existingQuery);
  if (!existingSnapshot.empty) {
    const existingDoc = existingSnapshot.docs[0];
    await updateDoc(doc(getDb(), PROFILES_COLLECTION, existingDoc.id), {
      ...data,
    });
    return existingDoc.id;
  }

  const docRef = await addDoc(collection(getDb(), PROFILES_COLLECTION), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getMentors = async (filters?: { expertise?: string }): Promise<MentorshipProfile[]> => {
  try {
    let q = query(
      collection(getDb(), PROFILES_COLLECTION),
      where('type', '==', 'mentor'),
      where('available', '==', true)
    );

    if (filters?.expertise) {
      q = query(q, where('expertise', 'array-contains', filters.expertise));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as MentorshipProfile[];
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return [];
  }
};

export const getMentees = async (): Promise<MentorshipProfile[]> => {
  try {
    const q = query(
      collection(getDb(), PROFILES_COLLECTION),
      where('type', '==', 'mentee')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as MentorshipProfile[];
  } catch (error) {
    console.error("Error fetching mentees:", error);
    return [];
  }
};

export const updateMentorshipProfile = async (userId: string, data: Partial<Omit<MentorshipProfile, 'id' | 'userId' | 'createdAt'>>): Promise<void> => {
  const q = query(
    collection(getDb(), PROFILES_COLLECTION),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    throw new Error("Mentorship profile not found");
  }

  const docRef = doc(getDb(), PROFILES_COLLECTION, snapshot.docs[0].id);
  await updateDoc(docRef, data);
};

export const getMyMentorshipProfile = async (userId: string): Promise<MentorshipProfile | null> => {
  try {
    const q = query(
      collection(getDb(), PROFILES_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as MentorshipProfile;
  } catch (error) {
    console.error("Error fetching mentorship profile:", error);
    return null;
  }
};

export const requestMentorship = async (mentorId: string, menteeId: string, message: string): Promise<string> => {
  const existingQuery = query(
    collection(getDb(), MENTORSHIPS_COLLECTION),
    where('mentorId', '==', mentorId),
    where('menteeId', '==', menteeId),
    where('status', 'in', ['pending', 'accepted'])
  );
  const existingSnapshot = await getDocs(existingQuery);
  if (!existingSnapshot.empty) {
    throw new Error("A mentorship request already exists with this user.");
  }

  const docRef = await addDoc(collection(getDb(), MENTORSHIPS_COLLECTION), {
    mentorId,
    menteeId,
    message,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getMyMentorships = async (userId: string): Promise<Mentorship[]> => {
  try {
    const asMentor = query(
      collection(getDb(), MENTORSHIPS_COLLECTION),
      where('mentorId', '==', userId)
    );
    const asMentee = query(
      collection(getDb(), MENTORSHIPS_COLLECTION),
      where('menteeId', '==', userId)
    );

    const [snapMentor, snapMentee] = await Promise.all([getDocs(asMentor), getDocs(asMentee)]);

    const mentorships: Mentorship[] = [];
    snapMentor.forEach(doc => mentorships.push({ id: doc.id, ...doc.data() } as Mentorship));
    snapMentee.forEach(doc => mentorships.push({ id: doc.id, ...doc.data() } as Mentorship));

    return mentorships;
  } catch (error) {
    console.error("Error fetching mentorships:", error);
    return [];
  }
};

export const updateMentorshipStatus = async (id: string, status: Mentorship['status']): Promise<void> => {
  await updateDoc(doc(getDb(), MENTORSHIPS_COLLECTION, id), { status });
};
