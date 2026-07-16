"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { getResearch, addResearch, deleteResearch, AABPResearch } from "@/lib/firebase/db-research";

export default function AdminResearchPage() {
  const [researchList, setResearchList] = useState<AABPResearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState(""); // comma separated
  const [field, setField] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    fetchResearch();
  }, []);

  async function fetchResearch() {
    setIsLoading(true);
    const data = await getResearch();
    setResearchList(data);
    setIsLoading(false);
  }

  const handleCreateResearch = async () => {
    if (!title || !abstract || !authors || !field || !date) {
      return toast.error("Please fill all required fields");
    }
    
    try {
      const authorArray = authors.split(',').map(a => a.trim());
      await addResearch({
        title,
        abstract,
        authors: authorArray,
        field,
        date,
        link
      });
      setIsDialogOpen(false);
      setTitle("");
      setAbstract("");
      setAuthors("");
      setField("");
      setDate("");
      setLink("");
      fetchResearch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create research publication");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      try {
        await deleteResearch(id);
        fetchResearch();
        toast.success("Publication deleted");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete publication");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Research CMS</h1>
          <p className="text-muted-foreground mt-1">Manage platform research publications.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="bg-primary text-white hover:bg-primary/90" />}>
            <Plus className="w-4 h-4 mr-2" />
            Add Publication
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Publication</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Publication Title" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Abstract / Summary</label>
                <Textarea value={abstract} onChange={e => setAbstract(e.target.value)} placeholder="Brief summary of the research..." className="h-24" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Authors (comma separated)</label>
                <Input value={authors} onChange={e => setAuthors(e.target.value)} placeholder="e.g. Dr. John Smith, Jane Doe" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Field / Category</label>
                <Input value={field} onChange={e => setField(e.target.value)} placeholder="e.g. Medical Science, Engineering" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date / Month</label>
                <Input value={date} onChange={e => setDate(e.target.value)} placeholder="e.g. August 2026" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">External Link (Optional)</label>
                <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateResearch}>Save Publication</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search publications..." className="pl-9 bg-secondary/30" />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20">
                <TableHead>Title</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Authors</TableHead>
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
              ) : researchList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No publications found. Add one to get started.</TableCell>
                </TableRow>
              ) : (
                researchList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-primary max-w-[250px] truncate" title={item.title}>
                      {item.title}
                    </TableCell>
                    <TableCell>{item.field}</TableCell>
                    <TableCell className="truncate max-w-[150px]">{item.authors.join(', ')}</TableCell>
                    <TableCell>{item.date}</TableCell>
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
