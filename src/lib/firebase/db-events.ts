import { getDb } from './config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, where, serverTimestamp } from 'firebase/firestore';

export interface AABPEvent {
  id?: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  category: string;
  status: 'Published' | 'Draft';
  imageUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any;
}

const EVENTS_COLLECTION = 'events';

export const getEvents = async (onlyPublished = false, maxLimit?: number): Promise<AABPEvent[]> => {
  try {
    const eventsRef = collection(getDb(), EVENTS_COLLECTION);
    let q = query(eventsRef, orderBy('createdAt', 'desc'));

    if (onlyPublished) {
      q = query(eventsRef, where('status', '==', 'Published'), orderBy('createdAt', 'desc'));
    }

    if (maxLimit) {
      q = query(q, limit(maxLimit));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AABPEvent[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const addEvent = async (event: Omit<AABPEvent, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(getDb(), EVENTS_COLLECTION), {
      ...event,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    throw error;
  }
};

export const updateEvent = async (id: string, updates: Partial<AABPEvent>): Promise<void> => {
  try {
    const docRef = doc(getDb(), EVENTS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const docRef = doc(getDb(), EVENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

const REGISTRATIONS_COLLECTION = 'event_registrations';

export const registerForEvent = async (eventId: string, userId: string): Promise<void> => {
  try {
    // Check if already registered
    const q = query(collection(getDb(), REGISTRATIONS_COLLECTION), where('eventId', '==', eventId), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      throw new Error("Already registered");
    }

    await addDoc(collection(getDb(), REGISTRATIONS_COLLECTION), {
      eventId,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    throw error;
  }
};

export const getUserEvents = async (userId: string): Promise<AABPEvent[]> => {
  try {
    // 1. Get all registrations for user
    const q = query(collection(getDb(), REGISTRATIONS_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const eventIds = snapshot.docs.map(doc => doc.data().eventId);

    // 2. Fetch those events in chunks of 10 to bypass Firestore 'in' limitation
    const eventsRef = collection(getDb(), EVENTS_COLLECTION);
    const events: AABPEvent[] = [];

    // Chunk array into size of 10
    const chunkSize = 10;
    for (let i = 0; i < eventIds.length; i += chunkSize) {
      const chunk = eventIds.slice(i, i + chunkSize);
      const eventsQuery = query(eventsRef, where('__name__', 'in', chunk));
      const eventsSnapshot = await getDocs(eventsQuery);

      const chunkEvents = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AABPEvent[];

      events.push(...chunkEvents);
    }

    return events;
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
};

export const getEventById = async (id: string): Promise<AABPEvent | null> => {
  try {
    const { getDoc } = await import('firebase/firestore');
    const docRef = doc(getDb(), EVENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AABPEvent;
    }
    return null;
  } catch (error) {
    console.error("Error fetching event by id:", error);
    return null;
  }
};

export const checkUserRegistration = async (eventId: string, userId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(getDb(), REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking user registration:", error);
    return false;
  }
};

export const getEventRegistrations = async (eventId: string): Promise<{ userId: string; createdAt: unknown }[]> => {
  try {
    const q = query(
      collection(getDb(), REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as { userId: string; createdAt: unknown });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }
};
