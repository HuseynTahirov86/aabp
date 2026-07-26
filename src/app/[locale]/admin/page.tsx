"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, FileText, Loader2, UserCheck } from "lucide-react";
import { getTotalUsersCount, getPendingUsersCount, getAllUsers, AABPUser } from "@/lib/firebase/db-users";
import { getEvents, AABPEvent } from "@/lib/firebase/db-events";
import { getResearch } from "@/lib/firebase/db-research";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ members: 0, events: 0, research: 0, pending: 0 });
  const [recentUsers, setRecentUsers] = useState<AABPUser[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<AABPEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [membersCount, pendingCount, allEvents, allResearch] = await Promise.all([
          getTotalUsersCount(),
          getPendingUsersCount(),
          getEvents(true),
          getResearch(),
        ]);
        
        setStats({
          members: membersCount,
          events: allEvents.length,
          research: allResearch.length,
          pending: pendingCount,
        });
        
        const users = await getAllUsers(5);
        setRecentUsers(users);
        setUpcomingEvents(allEvents.slice(0, 5));
      } catch (error) {
        console.error("Failed to load admin data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pt-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-serif text-primary">System Overview</h1>
        <p className="text-muted-foreground mt-2">Monitor platform metrics and recent activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
            <Users className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.members}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border border-amber-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <UserCheck className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Events</CardTitle>
            <CalendarDays className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.events}</div>
            <p className="text-xs text-muted-foreground mt-1">Total platform events</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Research Publications</CardTitle>
            <FileText className="w-4 h-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.research}</div>
            <p className="text-xs text-muted-foreground mt-1">Total publications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Recent Member Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent registrations.</p>
              ) : recentUsers.map((user, i) => (
                <div key={user.id || i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-semibold text-primary text-sm">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <span className={`text-xs border px-2 py-1 rounded ${user.role === 'PENDING' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-secondary border-border text-foreground'}`}>
                    {user.role || 'MEMBER'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No events found.</p>
              ) : upcomingEvents.map((ev, i) => (
                <div key={ev.id || i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border-l-4 border-accent">
                  <div>
                    <p className="font-semibold text-primary text-sm">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">{ev.date}</p>
                  </div>
                  <span className="text-xs font-bold text-primary">{ev.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
