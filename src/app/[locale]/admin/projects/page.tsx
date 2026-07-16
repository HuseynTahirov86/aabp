"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { getProjects, addProject, deleteProject, AABPProject } from "@/lib/firebase/db-projects";
import Image from "next/image";

export default function AdminProjectsPage() {
  const [projectsList, setProjectsList] = useState<AABPProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleCreateProject = async () => {
    if (!title || !summary) {
      return toast.error("Please fill all required fields");
    }
    
    try {
      await addProject({
        title,
        summary,
        status,
        imageUrl
      });
      setIsDialogOpen(false);
      setTitle("");
      setSummary("");
      setImageUrl("");
      setStatus("Published");
      fetchProjects();
      toast.success("Project created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        fetchProjects();
        toast.success("Project deleted");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete project");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Projects CMS</h1>
          <p className="text-muted-foreground mt-1">Manage ongoing and new projects.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-white hover:bg-primary/90" />}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
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
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      setImageUrl(data.url);
                      toast.success("Image uploaded successfully");
                    } catch (err) {
                      toast.error("Failed to upload image");
                      console.error(err);
                    } finally {
                      setUploadingImage(false);
                    }
                  }} 
                />
                {imageUrl && <p className="text-xs text-green-600 mt-1">Image URL generated: {imageUrl}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject} disabled={uploadingImage}>Save Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search projects..." className="pl-9 bg-secondary/30" />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20">
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
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : projectsList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No projects found. Add one to get started.</TableCell>
                </TableRow>
              ) : (
                projectsList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.title} width={40} height={40} className="object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-secondary rounded flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-primary max-w-[250px] truncate" title={item.title}>
                      {item.title}
                    </TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.createdAt ? new Date(item.createdAt.toDate?.() || item.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => item.id && handleDelete(item.id)}>
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
