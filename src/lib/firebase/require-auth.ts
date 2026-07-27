import { getAdminAuth, getAdminDb } from "./admin";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  role?: string;
}

/**
 * Verifies the Firebase ID token sent in the Authorization header
 * (format: "Bearer <idToken>"). Returns the decoded user, or null if
 * the token is missing/invalid. This performs a real cryptographic
 * verification via firebase-admin — unlike the client-writable
 * `userRole` cookie used for page-level route protection.
 */
export async function verifyRequestUser(request: Request): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const idToken = authHeader.slice("Bearer ".length);
  if (!idToken) return null;

  try {
    const adminAuth = await getAdminAuth();
    if (!adminAuth) return null;

    const decoded = await adminAuth.verifyIdToken(idToken);
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

/**
 * Same as verifyRequestUser, but also looks up the user's role in
 * Firestore and requires it to be ADMIN or SUPER_ADMIN. Returns null
 * if the token is invalid or the user isn't an admin.
 */
export async function requireAdmin(request: Request): Promise<AuthenticatedUser | null> {
  const user = await verifyRequestUser(request);
  if (!user) return null;

  const db = await getAdminDb();
  if (!db) return null;

  const snap = await db.collection("users").doc(user.uid).get();
  const role = snap.exists ? (snap.data()?.role as string | undefined) : undefined;

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") return null;

  return { ...user, role };
}
