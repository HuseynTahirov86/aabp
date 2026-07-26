import { getDb } from './config';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, serverTimestamp, or, getDoc, orderBy } from 'firebase/firestore';

export interface Connection {
  id?: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: ReturnType<typeof serverTimestamp>;
}

const CONNECTIONS_COLLECTION = 'connections';

export const sendConnectionRequest = async (fromUserId: string, toUserId: string): Promise<string> => {
  const existingQuery = query(
    collection(getDb(), CONNECTIONS_COLLECTION),
    where('fromUserId', '==', fromUserId),
    where('toUserId', '==', toUserId)
  );
  const existingSnapshot = await getDocs(existingQuery);
  if (!existingSnapshot.empty) {
    throw new Error("Connection request already sent");
  }

  const reverseQuery = query(
    collection(getDb(), CONNECTIONS_COLLECTION),
    where('fromUserId', '==', toUserId),
    where('toUserId', '==', fromUserId)
  );
  const reverseSnapshot = await getDocs(reverseQuery);
  if (!reverseSnapshot.empty) {
    throw new Error("Connection already exists");
  }

  const docRef = await addDoc(collection(getDb(), CONNECTIONS_COLLECTION), {
    fromUserId,
    toUserId,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getUserConnections = async (userId: string): Promise<Connection[]> => {
  const q1 = query(
    collection(getDb(), CONNECTIONS_COLLECTION),
    where('fromUserId', '==', userId),
    where('status', '==', 'accepted')
  );
  const q2 = query(
    collection(getDb(), CONNECTIONS_COLLECTION),
    where('toUserId', '==', userId),
    where('status', '==', 'accepted')
  );

  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

  const connections: Connection[] = [];
  snap1.forEach(doc => connections.push({ id: doc.id, ...doc.data() } as Connection));
  snap2.forEach(doc => connections.push({ id: doc.id, ...doc.data() } as Connection));

  return connections;
};

export const getPendingConnections = async (userId: string): Promise<Connection[]> => {
  const q = query(
    collection(getDb(), CONNECTIONS_COLLECTION),
    where('toUserId', '==', userId),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Connection[];
};

export const acceptConnection = async (connectionId: string): Promise<void> => {
  const docRef = doc(getDb(), CONNECTIONS_COLLECTION, connectionId);
  await updateDoc(docRef, { status: 'accepted' });
};

export const rejectConnection = async (connectionId: string): Promise<void> => {
  const docRef = doc(getDb(), CONNECTIONS_COLLECTION, connectionId);
  await updateDoc(docRef, { status: 'rejected' });
};
