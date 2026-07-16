import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    // Allow the client to specify a module/folder name (e.g., "articles", "events", "profiles")
    // Default to "general" if not provided
    const folderType = (formData.get('folder') as string) || 'general';
    
    // Basic validation to prevent directory traversal
    const safeFolderType = folderType.replace(/[^a-zA-Z0-9_-]/g, '');

    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 5MB limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a professional directory structure: /storage/<type>/<YYYY>/<MM>
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalExtension = file.name.split('.').pop() || 'png';
    const filename = `${uniqueSuffix}.${originalExtension}`;

    // Relative path used for URLs (without 'storage' prefix since we use the API)
    const relativeStoragePath = path.join(safeFolderType, year, month);
    
    // Absolute path used for writing to the local filesystem
    const absoluteStoragePath = path.join(process.cwd(), 'storage', relativeStoragePath);
    
    try {
      await mkdir(absoluteStoragePath, { recursive: true });
    } catch {
      // Ignore if directory already exists
    }

    // Write file to the nested local storage path
    const filePath = path.join(absoluteStoragePath, filename);
    await writeFile(filePath, buffer);

    // Return the URL pointing to our custom storage API
    // Uses POSIX format (forward slashes) for web URLs
    const publicUrl = `/api/storage/${relativeStoragePath.replace(/\\/g, '/')}/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading file to local storage:", error);
    return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
  }
}
