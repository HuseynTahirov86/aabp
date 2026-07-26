"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarDays, FileText, Loader2, UserCheck, BarChart2, Ticket, TrendingUp } from "lucide-react";
import { getTotalUsersCount, getPendingUsersCount, getAllUsers, AABPUser } from "@/lib/firebase/db-users";
import { getEvents, getEventRegistrations, AABPEvent } from "@/lib/firebase/db-events";
import { getResearch } from "@/lib/firebase/db-research";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getLastSixMonths() {
  const now = new Date();
  const result: { label: string; month: number; year: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ label: MONTHS[d.getMonth()], month: d.getMonth(), year: d.getFullYear() });
  }
  return result;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ members: 0, events: 0, research: 0, pending: 0 });
  const [recentUsers, setRecentUsers] = useState<AABPUser[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<AABPEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [monthlyData, setMonthlyData] = useState<{ label: string; count: number }[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({ total: 0, avg: 0 });
  const [topEvents, setTopEvents] = useState<{ title: string; count: number }[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

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

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [allUsers, allEvents] = await Promise.all([
          getAllUsers(),
          getEvents(true),
        ]);

        const months = getLastSixMonths();
        const monthlyCounts = months.map(m => ({
          label: m.label,
          count: 0,
        }));

        allUsers.forEach(user => {
          if (user.createdAt) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const c = user.createdAt as any;
            const date = c.toDate ? c.toDate() : new Date(user.createdAt);
            const idx = months.findIndex(m => m.month === date.getMonth() && m.year === date.getFullYear());
            if (idx !== -1) {
              monthlyCounts[idx].count += 1;
            }
          }
        });
        setMonthlyData(monthlyCounts);

        let totalRegistrations = 0;
        const eventRegCounts: { title: string; count: number }[] = [];

        await Promise.all(allEvents.map(async (ev) => {
          if (!ev.id) return;
          const regs = await getEventRegistrations(ev.id);
          totalRegistrations += regs.length;
          eventRegCounts.push({ title: ev.title, count: regs.length });
        }));

        const avg = allEvents.length > 0 ? totalRegistrations / allEvents.length : 0;
        setAttendanceStats({ total: totalRegistrations, avg });

        eventRegCounts.sort((a, b) => b.count - a.count);
        setTopEvents(eventRegCounts.slice(0, 5));
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchAnalytics();
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

      {!analyticsLoading && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-bold font-serif text-primary mb-6">Analytics</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-base text-primary">Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 p-4 bg-secondary/30 rounded-lg text-center">
                      <Ticket className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{attendanceStats.total}</div>
                      <p className="text-xs text-muted-foreground">Total Registrations</p>
                    </div>
                    <div className="flex-1 p-4 bg-secondary/30 rounded-lg text-center">
                      <TrendingUp className="w-5 h-5 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{attendanceStats.avg.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground">Avg per Event</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-border">
                <CardHeader>
                  <CardTitle className="text-base text-primary">Top Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {topEvents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No registrations yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {topEvents.map((ev, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">#{i + 1}</span>
                            <span className="text-sm text-primary truncate">{ev.title}</span>
                          </div>
                          <span className="text-sm font-semibold text-accent shrink-0 ml-2">{ev.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm border-border">
              <CardHeader>
                <CardTitle className="text-base text-primary">Monthly Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyData.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data available.</p>
                ) : (
                  <div className="flex items-end justify-between gap-2 h-40">
                    {monthlyData.map((m, i) => {
                      const maxCount = Math.max(...monthlyData.map(d => d.count), 1);
                      const heightPct = (m.count / maxCount) * 100;
                      return (
                        <div key={i} className="flex flex-col items-center flex-1 min-w-0">
                          <div className="flex flex-col items-center w-full">
                            <span className="text-xs font-semibold text-primary mb-1">{m.count}</span>
                            <div className="w-full bg-border rounded-t-sm" style={{ height: '100px', position: 'relative' }}>
                              <div
                                className="absolute bottom-0 w-full bg-accent rounded-t-sm transition-all duration-300"
                                style={{ height: `${heightPct}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground mt-2">{m.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

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
