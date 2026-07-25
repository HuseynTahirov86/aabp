"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash2, Loader2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { getJobs, addJob, updateJob, deleteJob, AABPJob } from "@/lib/firebase/db-jobs";
import { toast } from "sonner";

export default function AdminCareerPage() {
  const [jobs, setJobs] = useState<AABPJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setIsLoading(true);
    const data = await getJobs();
    setJobs(data);
    setIsLoading(false);
  }

  const resetForm = () => {
    setTitle("");
    setCompany("");
    setLocation("");
    setType("");
    setDescription("");
    setLink("");
    setEditingId(null);
  };

  const openEditDialog = (job: AABPJob) => {
    setEditingId(job.id || null);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setType(job.type);
    setDescription(job.description);
    setLink(job.link);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title || !company || !location || !type || !description || !link) {
      return toast.error("Please fill all fields");
    }
    
    try {
      if (editingId) {
        await updateJob(editingId, {
          title,
          company,
          location,
          type,
          description,
          link
        });
        toast.success("Job updated");
      } else {
        await addJob({
          title,
          company,
          location,
          type,
          description,
          link
        });
        toast.success("Job posted successfully!");
      }
      setIsDialogOpen(false);
      resetForm();
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save job");
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteJob(deleteTargetId);
      fetchJobs();
      toast.success("Job deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job");
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  const filteredJobs = jobs.filter(job =>
    !searchQuery ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Career CMS</h1>
          <p className="text-muted-foreground mt-1">Manage job and mentorship opportunities.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger render={
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Post Opportunity
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Opportunity" : "Post New Opportunity"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Job Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Company / Organization</label>
                <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="e.g. Google DeepMind" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Location</label>
                <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. London, UK (Hybrid)" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Type</label>
                <Input value={type} onChange={e => setType(e.target.value)} placeholder="e.g. Full-time, Internship" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Job responsibilities..." className="h-24" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Application Link</label>
                <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>{editingId ? "Update" : "Publish"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to delete this job posting? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search jobs..."
              className="pl-9 bg-secondary/30"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20">
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
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
              ) : filteredJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No opportunities found.</TableCell>
                </TableRow>
              ) : (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium text-primary">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => openEditDialog(job)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => job.id && handleDelete(job.id)}>
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
