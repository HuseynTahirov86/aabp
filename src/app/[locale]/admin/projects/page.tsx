"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash2, Loader2, Image as ImageIcon, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { getProjects, addProject, updateProject, deleteProject, AABPProject } from "@/lib/firebase/db-projects";
import { uploadFile } from "@/lib/upload";
import Image from "next/image";

export default function AdminProjectsPage() {
  const [projectsList, setProjectsList] = useState<AABPProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<'Published' | 'Draft'>("Published");

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setIsLoading(true);
    const data = await getProjects();
    setProjectsList(data);
    setIsLoading(false);
  }

  const resetForm = () => {
    setTitle("");
    setSummary("");
    setImageUrl("");
    setStatus("Published");
    setEditingId(null);
  };

  const openEditDialog = (item: AABPProject) => {
    setEditingId(item.id || null);
    setTitle(item.title);
    setSummary(item.summary);
    setImageUrl(item.imageUrl || "");
    setStatus(item.status);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title || !summary) {
      return toast.error("Please fill all required fields");
    }
    
    try {
      if (editingId) {
        await updateProject(editingId, {
          title,
          summary,
          status,
          imageUrl
        });
        toast.success("Project updated");
      } else {
        await addProject({
          title,
          summary,
          status,
          imageUrl
        });
        toast.success("Project created");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save project");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteProject(deleteTargetId);
      fetchProjects();
      toast.success("Project deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const filteredList = projectsList.filter(item =>
    !searchQuery ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Projects CMS</h1>
          <p className="text-white/70 mt-1">Manage ongoing and new projects.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger render={
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Summary</label>
                <Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Brief summary of the project..." className="h-24" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <select 
                  value={status} 
                  onChange={e => setStatus(e.target.value as 'Published' | 'Draft')} 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Image Upload</label>
                <Input 
                  type="file" 
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImage(true);
                    try {
                      const url = await uploadFile(file, 'projects');
                      setImageUrl(url);
                      toast.success("Image uploaded successfully");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Failed to upload image");
                    } finally {
                      setUploadingImage(false);
                    }
                  }} 
                />
                {imageUrl && <p className="text-xs text-emerald-400 mt-1">Image URL generated: {imageUrl}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} disabled={uploadingImage}>{editingId ? "Update Project" : "Save Project"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-white/70">Are you sure you want to delete this project? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white/10 p-6 rounded-2xl shadow-sm border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              className="pl-9 bg-white/5"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-white/5">
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-white/70" />
                  </TableCell>
                </TableRow>
              ) : filteredList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-white/70">No projects found. Add one to get started.</TableCell>
                </TableRow>
              ) : (
                filteredList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} width={40} height={40} className="object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-white/70">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-white max-w-[250px] truncate" title={item.title}>
                      {item.title}
                    </TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.createdAt ? new Date(item.createdAt.toDate?.() || item.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-primary/10" onClick={() => openEditDialog(item)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => item.id && handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
