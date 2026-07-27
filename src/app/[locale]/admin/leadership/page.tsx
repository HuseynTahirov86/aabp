"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommitteeMembers, addCommitteeMember, updateCommitteeMember, deleteCommitteeMember, AABPCommitteeMember } from "@/lib/firebase/db-committee";
import { Loader2, Trash2, Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function AdminLeadershipPage() {
  const [members, setMembers] = useState<AABPCommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
  const [newMember, setNewMember] = useState<{ name: string, role: string, bio: string, imageUrl: string, linkedin: string, order: number }>({
    name: '', role: '', bio: '', imageUrl: '', linkedin: '', order: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const data = await getCommitteeMembers();
    setMembers(data);
    setLoading(false);
  }

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      if (editingMemberId) {
        await updateCommitteeMember(editingMemberId, newMember);
        toast.success("Member updated successfully");
      } else {
        await addCommitteeMember(newMember);
        toast.success("Member added successfully");
      }
      resetForm();
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save member");
    } finally {
      setIsAdding(false);
    }
  };

  const resetForm = () => {
    setNewMember({ name: '', role: '', bio: '', imageUrl: '', linkedin: '', order: 0 });
    setEditingMemberId(null);
  };

  const startEdit = (member: AABPCommitteeMember) => {
    setEditingMemberId(member.id || null);
    setNewMember({
      name: member.name,
      role: member.role,
      bio: member.bio,
      imageUrl: member.imageUrl || '',
      linkedin: member.linkedin || '',
      order: member.order || 0
    });
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteCommitteeMember(deleteTargetId);
      toast.success("Member deleted");
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete member");
    } finally {
      setIsDeleteOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div>
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Leadership CMS</h1>
          <p className="text-white/70 mt-2">Manage Executive Committee members.</p>
        </div>
        <Button onClick={fetchMembers} variant="outline">Refresh List</Button>
      </div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-white/70">Are you sure you want to delete this member? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteOpen(false); setDeleteTargetId(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-white/10 sticky top-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                {editingMemberId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />} 
                {editingMemberId ? "Edit Member" : "New Member"}
              </CardTitle>
              {editingMemberId && (
                <Button variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveMember} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Full Name</label>
                  <Input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="e.g. Dr. John Doe" />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Role / Title</label>
                  <Input required value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} placeholder="e.g. Chairman" />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Short Bio</label>
                  <Textarea required value={newMember.bio} onChange={e => setNewMember({...newMember, bio: e.target.value})} placeholder="Short description" rows={3} />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">LinkedIn Profile (Optional)</label>
                  <Input value={newMember.linkedin} onChange={e => setNewMember({...newMember, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Display Order</label>
                  <Input type="number" required value={newMember.order} onChange={e => setNewMember({...newMember, order: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-white/70 mb-1 block">Profile Photo Upload</label>
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
                        setNewMember({ ...newMember, imageUrl: data.url });
                        toast.success("Image uploaded successfully");
                      } catch (err) {
                        toast.error("Failed to upload image");
                        console.error(err);
                      } finally {
                        setUploadingImage(false);
                      }
                    }} 
                  />
                  {newMember.imageUrl && <p className="text-xs text-emerald-400 mt-1 line-clamp-1">Uploaded: {newMember.imageUrl}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isAdding || uploadingImage}>
                  {isAdding ? "Saving..." : (editingMemberId ? "Update Member" : "Add Member")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="shadow-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">Committee Members</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
              ) : members.length === 0 ? (
                <p className="text-sm text-white/70">No members found.</p>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex justify-between items-start p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex gap-4">
                        {member.imageUrl ? (
                          <Image src={member.imageUrl} alt={member.name} width={64} height={64} className="rounded-full object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-white">{member.name}</h4>
                          <p className="text-sm font-medium text-accent">{member.role}</p>
                          <p className="text-xs text-white/70 mt-1 line-clamp-2">{member.bio}</p>
                          <p className="text-xs text-white/70 mt-1">Order: {member.order}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => startEdit(member)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => member.id && handleDelete(member.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
