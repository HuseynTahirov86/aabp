"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers, AABPUser, updateUserProfile } from "@/lib/firebase/db-users";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminMembersPage() {
  const [users, setUsers] = useState<AABPUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  }

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      let newRole = 'MEMBER';
      if (currentRole === 'MEMBER' || !currentRole) newRole = 'EDITOR';
      else if (currentRole === 'EDITOR') newRole = 'ADMIN';
      else if (currentRole === 'ADMIN') newRole = 'MEMBER';

      await updateUserProfile(userId, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  return (
    <div>
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Member Directory</h1>
          <p className="text-muted-foreground mt-2">Manage user accounts and roles.</p>
        </div>
        <Button onClick={fetchUsers} variant="outline">Refresh List</Button>
      </div>

      <Card className="shadow-sm border-border">
        <CardHeader>
          <CardTitle className="text-lg text-primary">All Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                  <tr>
                    <th className="px-6 py-3 rounded-tl-lg">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Profession</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3 rounded-tr-lg">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="bg-card border-b border-border">
                      <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 text-muted-foreground">{user.profession || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'bg-primary text-white' : user.role === 'EDITOR' ? 'bg-accent text-white' : 'bg-secondary text-primary'}`}>
                          {user.role || 'MEMBER'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleUserRole(user.id, user.role || 'MEMBER')}
                          disabled={user.role === 'SUPER_ADMIN'}
                        >
                          Change Role
                        </Button>
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
