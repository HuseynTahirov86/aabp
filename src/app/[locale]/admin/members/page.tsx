"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers, updateUserRole, deleteUser, AABPUser } from "@/lib/firebase/db-users";
import { Loader2, Download, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminMembersPage() {
  const [users, setUsers] = useState<AABPUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  }

  const handleApprove = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      await updateUserRole(userId, "MEMBER");
      setUsers(users.map(u => u.id === userId ? { ...u, role: "MEMBER" } : u));
      toast.success("Member approved");

      if (user?.email) {
        fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, firstName: user.firstName, type: 'APPROVAL' }),
        }).catch(() => {});
      }
    } catch { toast.error("Failed to approve"); }
  };

  const handleReject = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      toast.success("Application rejected and removed");
    } catch { toast.error("Failed to reject"); }
  };

  const handleDelete = (userId: string) => {
    setDeleteTarget(userId);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget);
      setUsers(users.filter(u => u.id !== deleteTarget));
      toast.success("User deleted");
    } catch { toast.error("Failed to delete user"); }
    finally { setDeleteOpen(false); setDeleteTarget(null); }
  };

  const handleExportCsv = () => {
    const headers = "Name,Email,Profession,Role,Phone,LinkedIn,Registered\n";
    const rows = users.map(u =>
      `"${u.firstName} ${u.lastName}","${u.email}","${u.profession || ''}","${u.role}","${u.phone || ''}","${u.linkedin || ''}","${u.createdAt || ''}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "aabp-members.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const getRoleBadge = (role: string) => {
    if (role === 'PENDING') return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') return 'bg-red-500/25 text-white border border-red-500/30';
    if (role === 'EDITOR') return 'bg-blue-500/25 text-white border border-blue-500/30';
    return 'bg-white/10 text-white border border-white/10';
  };

  return (
    <div>
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white">Member Directory</h1>
          <p className="text-white/70 mt-2">Manage user accounts, approvals, and roles.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportCsv} variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={fetchUsers} variant="outline">Refresh List</Button>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-white/70">Are you sure you want to delete this user? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteOpen(false); setDeleteTarget(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="shadow-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white">All Registered Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-white" /></div>
          ) : users.length === 0 ? (
            <p className="text-sm text-white/70">No members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-white/70 uppercase bg-white/5">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Profession</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="bg-white/10 border-b border-white/10">
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{user.firstName} {user.lastName}</td>
                      <td className="px-4 py-3 text-white/70">{user.email}</td>
                      <td className="px-4 py-3 text-white/70">{user.profession || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(user.role || 'MEMBER')}`}>
                          {user.role || 'MEMBER'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {user.role === 'PENDING' && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50" onClick={() => handleApprove(user.id)} title="Approve">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:text-amber-700 hover:bg-amber-50" onClick={() => handleReject(user.id)} title="Reject">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {user.role !== 'SUPER_ADMIN' && user.role !== 'PENDING' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(user.id)} title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
