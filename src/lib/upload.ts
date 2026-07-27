import { getAuthInstance } from "@/lib/firebase/config";

/**
 * Uploads a file to /api/upload, attaching the current user's Firebase
 * ID token so the (now-authenticated-only) endpoint accepts the request.
 * Throws if there's no signed-in user or the upload fails.
 */
export async function uploadFile(file: File, folder: string): Promise<string> {
  const currentUser = getAuthInstance().currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in to upload files.");
  }
  const idToken = await currentUser.getIdToken();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Upload failed");
  }

  const data = await res.json();
  return data.url as string;
}
