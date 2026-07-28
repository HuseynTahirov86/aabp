"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { getResources, addResource, deleteResource, Resource } from "@/lib/firebase/db-resources";
import { getAuthInstance } from "@/lib/firebase/config";
import { uploadFile } from "@/lib/upload";

const CATEGORIES = ["Medical Science", "Natural Science", "Life Science", "Social Science", "Engineering", "Career", "Events"];

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setIsLoading(true);
    const data = await getResources();
    setResources(data);
    setIsLoading(false);
  }

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setFileUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, "resources");
      setFileUrl(url);
      toast.success("File uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !description || !category) {
      return toast.error("Please fill all required fields");
    }

    try {
      const user = getAuthInstance().currentUser;
      await addResource({
        title,
        description,
        fileUrl: fileUrl || "#",
        category,
        uploadedBy: user?.uid || "admin",
      });
      toast.success("Resource added");
      setIsDialogOpen(false);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add resource");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteResource(deleteTargetId);
      fetchResources();
      toast.success("Resource deleted");
    } catch {
      toast.error("Failed to delete resource");
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Resource Library CMS</h1>
          <p className="text-white/70 mt-1">Manage downloadable resources for members.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger render={
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px] bg-[#0A192F] text-white border-white/10">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Resource title" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." className="h-24" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">File Upload</label>
                <div className="flex gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                  </div>
                )}
                {fileUrl && (
                  <p className="text-xs text-emerald-400 truncate">Uploaded: {fileUrl}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={uploading}>Save Resource</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[#0A192F] text-white border-white/10">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-white/70">Are you sure you want to delete this resource?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white/10 p-6 rounded-2xl shadow-sm border border-white/10">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5">
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-white/70" />
                  </TableCell>
                </TableRow>
              ) : resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-white/70">No resources yet.</TableCell>
                </TableRow>
              ) : (
                resources.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium max-w-[250px] truncate">{r.title}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{r.fileUrl}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => r.id && handleDelete(r.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
