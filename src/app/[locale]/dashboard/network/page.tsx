"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Section, SectionHeader } from "@/components/shared/Section";
import { CommitteeCard } from "@/components/shared/cards/CommitteeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowLeft, Filter, UserPlus, UserCheck, UserX, Users } from "lucide-react";
import { getPublicUsers, AABPUser, getUserProfile } from "@/lib/firebase/db-users";
import { useAuth } from "@/lib/firebase/useAuth";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';
import { toast } from "sonner";
import { getPendingConnections, getUserConnections, acceptConnection, rejectConnection, Connection } from "@/lib/firebase/db-connections";

export default function MyNetworkPage() {
  const t = useTranslations('Dashboard');
  const tNet = useTranslations('Network');
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [users, setUsers] = useState<AABPUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [professionFilter, setProfessionFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [pendingRequests, setPendingRequests] = useState<{ id: string; fromUserId: string; toUserId: string; status: Connection['status']; createdAt: Connection['createdAt'] }[]>([]);
  const [pendingUsers, setPendingUsers] = useState<Map<string, AABPUser | null>>(new Map());
  const [connectedUserIds, setConnectedUserIds] = useState<Set<string>>(new Set());
  const [connectedUsers, setConnectedUsers] = useState<AABPUser[]>([]);
  const [activeTab, setActiveTab] = useState<"discover" | "pending" | "connected">("discover");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const [allUsers, connections, pending] = await Promise.all([
          getPublicUsers(),
          getUserConnections(user.uid),
          getPendingConnections(user.uid)
        ]);

        setUsers(allUsers.filter(u => u.id !== user.uid));
        const validPending = pending.filter(r => r.id) as { id: string; fromUserId: string; toUserId: string; status: Connection['status']; createdAt: Connection['createdAt'] }[];
        setPendingRequests(validPending);

        const connectedIds = new Set<string>();
        connections.forEach(c => {
          if (c.fromUserId === user.uid) connectedIds.add(c.toUserId);
          if (c.toUserId === user.uid) connectedIds.add(c.fromUserId);
        });
        setConnectedUserIds(connectedIds);

        const connectedProfiles = allUsers.filter(u => connectedIds.has(u.id));
        setConnectedUsers(connectedProfiles);

        const pendingUserMap = new Map<string, AABPUser | null>();
        await Promise.all(
          validPending.map(async (req) => {
            const profile = await getUserProfile(req.fromUserId);
            pendingUserMap.set(req.id, profile);
          })
        );
        setPendingRequests(validPending);
        setPendingUsers(pendingUserMap);

        setIsLoading(false);
      };
      fetchData();
    }
  }, [user]);

  const handleAccept = async (connectionId: string) => {
    setActionLoading(connectionId);
    try {
      await acceptConnection(connectionId);
      toast.success("Connection accepted!");
      const pending = pendingRequests.find(r => r.id === connectionId);
      if (pending) {
        const profile = pendingUsers.get(connectionId);
        if (profile) {
          setConnectedUsers(prev => [...prev, profile]);
          setConnectedUserIds(prev => new Set(prev).add(pending.fromUserId));
        }
      }
      setPendingRequests(prev => prev.filter(r => r.id !== connectionId));
      setPendingUsers(prev => {
        const next = new Map(prev);
        next.delete(connectionId);
        return next;
      });
    } catch {
      toast.error("Failed to accept connection");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (connectionId: string) => {
    setActionLoading(connectionId);
    try {
      await rejectConnection(connectionId);
      toast.success("Connection rejected");
      setPendingRequests(prev => prev.filter(r => r.id !== connectionId));
      setPendingUsers(prev => {
        const next = new Map(prev);
        next.delete(connectionId);
        return next;
      });
    } catch {
      toast.error("Failed to reject connection");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const prof = (u.profession || "").toLowerCase();
    const inst = (u.institution || "").toLowerCase();
    const country = (u.country || "").toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = fullName.includes(query) || prof.includes(query) || inst.includes(query);
    const matchesCountry = countryFilter ? country.includes(countryFilter.toLowerCase()) : true;
    const matchesProf = professionFilter ? prof.includes(professionFilter.toLowerCase()) : true;

    return matchesSearch && matchesCountry && matchesProf;
  });

  return (
    <main className="min-h-screen bg-secondary/20 pt-8 pb-12">
      <Section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('backToDashboard')}
          </Link>
          
          <SectionHeader
            title={t('myNetworkTitle')}
            subtitle={tNet('title')}
          />

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <Button
              variant={activeTab === "discover" ? "default" : "outline"}
              onClick={() => setActiveTab("discover")}
              className="rounded-xl"
            >
              <Search className="w-4 h-4 mr-2" /> Discover
            </Button>
            <Button
              variant={activeTab === "pending" ? "default" : "outline"}
              onClick={() => setActiveTab("pending")}
              className="rounded-xl"
            >
              <UserPlus className="w-4 h-4 mr-2" /> Pending{pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ""}
            </Button>
            <Button
              variant={activeTab === "connected" ? "default" : "outline"}
              onClick={() => setActiveTab("connected")}
              className="rounded-xl"
            >
              <Users className="w-4 h-4 mr-2" /> Connected{connectedUsers.length > 0 ? ` (${connectedUsers.length})` : ""}
            </Button>
          </div>

          {activeTab === "discover" && (
            <>
              <div className="mb-12 bg-card p-6 rounded-2xl shadow-sm border border-border">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder={t('myNetworkSearchPlaceholder')}
                      className="pl-12 h-12 bg-secondary/30"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="h-12 px-6"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4 mr-2" /> {t('filters')}
                  </Button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('countryLabel')}</label>
                      <Input
                        placeholder={t('countryPlaceholder')}
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('professionLabel')}</label>
                      <Input
                        placeholder={t('professionPlaceholder')}
                        value={professionFilter}
                        onChange={(e) => setProfessionFilter(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border border-border">
                  <p className="text-xl text-muted-foreground">{tNet('noMembers') || "No members found matching your criteria."}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredUsers.map((u, i) => (
                    <CommitteeCard 
                      key={u.id}
                      name={`${u.firstName} ${u.lastName}`}
                      role={u.profession || "Member"}
                      bio={u.bio || ""}
                      email={u.email}
                      linkedinUrl={u.linkedin}
                      imageUrl={u.photoUrl}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "pending" && (
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg">No pending connection requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map(req => {
                    const profile = pendingUsers.get(req.id);
                    return (
                      <div key={req.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {profile ? `${profile.firstName[0]}${profile.lastName[0]}` : "??"}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {profile ? `${profile.firstName} ${profile.lastName}` : "Unknown User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {profile?.profession || ""}{profile?.institution ? ` — ${profile.institution}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAccept(req.id)}
                            disabled={actionLoading === req.id}
                          >
                            {actionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserCheck className="w-4 h-4 mr-2" /> Accept</>}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(req.id)}
                            disabled={actionLoading === req.id}
                          >
                            <UserX className="w-4 h-4 mr-2" /> Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "connected" && (
            <div>
              {connectedUsers.length === 0 ? (
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg">No connections yet. Discover members to connect!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {connectedUsers.map((u, i) => (
                    <CommitteeCard 
                      key={u.id}
                      name={`${u.firstName} ${u.lastName}`}
                      role={u.profession || "Member"}
                      bio={u.bio || ""}
                      email={u.email}
                      linkedinUrl={u.linkedin}
                      imageUrl={u.photoUrl}
                      index={i}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
