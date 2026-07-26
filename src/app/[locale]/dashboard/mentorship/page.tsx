"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Section } from "@/components/shared/Section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, UserPlus, GraduationCap, Users, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "@/lib/firebase/useAuth";
import {
  createMentorshipProfile,
  getMyMentorshipProfile,
  getMentors,
  requestMentorship,
  getMyMentorships,
  MentorshipProfile,
  Mentorship,
} from "@/lib/firebase/db-mentorship";
import { toast } from "sonner";

type Tab = "profile" | "find" | "my";

export default function MentorshipPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="min-h-screen bg-secondary/20 pt-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/20 pt-8 pb-12">
      <Section className="py-8 md:py-12">
        <h1 className="text-4xl font-bold font-serif text-foreground mb-2">Mentorship</h1>
        <p className="text-foreground/70 text-lg mb-8">Connect with mentors and mentees in your field.</p>

        <div className="flex gap-2 mb-8 border-b border-border pb-4">
          {(["profile", "find", "my"] as Tab[]).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "ghost"}
              className="rounded-full"
              onClick={() => setActiveTab(tab)}
            >
              {tab === "profile" && <><GraduationCap className="w-4 h-4 mr-2" />My Profile</>}
              {tab === "find" && <><Users className="w-4 h-4 mr-2" />Find Mentors</>}
              {tab === "my" && <><UserPlus className="w-4 h-4 mr-2" />My Mentorships</>}
            </Button>
          ))}
        </div>

        {activeTab === "profile" && <ProfileTab userId={user.uid} />}
        {activeTab === "find" && <FindMentorsTab userId={user.uid} />}
        {activeTab === "my" && <MyMentorshipsTab userId={user.uid} />}
      </Section>
    </main>
  );
}

function ProfileTab({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<MentorshipProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<"mentor" | "mentee">("mentee");
  const [expertise, setExpertise] = useState("");
  const [bio, setBio] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await getMyMentorshipProfile(userId);
      if (p) {
        setProfile(p);
        setType(p.type);
        setExpertise(p.expertise.join(", "));
        setBio(p.bio);
        setAvailable(p.available);
      }
      setLoading(false);
    })();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createMentorshipProfile(userId, {
        type,
        expertise: expertise.split(",").map((s) => s.trim()).filter(Boolean),
        bio,
        available,
      });
      toast.success("Mentorship profile saved!");
      const p = await getMyMentorshipProfile(userId);
      setProfile(p);
    } catch (err) {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-64 w-full rounded-xl" />;

  return (
    <Card className="shadow-sm border-border max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{profile ? "Update Your" : "Create Your"} Mentorship Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">I want to be a...</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="mentor"
                checked={type === "mentor"}
                onChange={() => setType("mentor")}
                className="w-4 h-4"
              />
              Mentor
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="mentee"
                checked={type === "mentee"}
                onChange={() => setType("mentee")}
                className="w-4 h-4"
              />
              Mentee
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Expertise (comma-separated)</label>
          <Input
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="e.g. Machine Learning, Python, Data Science"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell mentees/mentors about yourself..."
            className="h-24"
          />
        </div>

        {type === "mentor" && (
          <div className="flex items-center gap-2">
            <button onClick={() => setAvailable(!available)} className="focus:outline-none">
              {available ? (
                <ToggleRight className="w-6 h-6 text-green-500" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-muted-foreground" />
              )}
            </button>
            <span className="text-sm">Available for mentoring</span>
          </div>
        )}

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {profile ? "Update Profile" : "Create Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}

function FindMentorsTab({ userId }: { userId: string }) {
  const [mentors, setMentors] = useState<MentorshipProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());
  const [messageMap, setMessageMap] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const m = await getMentors();
      setMentors(m);
      setLoading(false);
    })();
  }, []);

  const handleConnect = async (mentorId: string) => {
    const message = messageMap[mentorId] || "";
    setConnectingIds((prev) => new Set(prev).add(mentorId));
    try {
      await requestMentorship(mentorId, userId, message);
      toast.success("Mentorship request sent!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send request.");
    } finally {
      setConnectingIds((prev) => {
        const next = new Set(prev);
        next.delete(mentorId);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <Card className="shadow-sm border-border max-w-2xl mx-auto p-8 text-center">
        <p className="text-muted-foreground">No mentors available at the moment. Check back later!</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <Card key={mentor.id} className="shadow-sm border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{mentor.userId === userId ? "You (Mentor)" : "Mentor"}</CardTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              {mentor.expertise.map((exp) => (
                <Badge key={exp} variant="secondary" className="text-xs">{exp}</Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{mentor.bio}</p>
            <Input
              placeholder="Message (optional)"
              className="mb-3 text-sm"
              value={messageMap[mentor.userId] || ""}
              onChange={(e) => setMessageMap({ ...messageMap, [mentor.userId]: e.target.value })}
            />
            <Button
              className="w-full"
              size="sm"
              onClick={() => handleConnect(mentor.userId)}
              disabled={connectingIds.has(mentor.userId) || mentor.userId === userId}
            >
              {connectingIds.has(mentor.userId) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Request Mentorship"
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MyMentorshipsTab({ userId }: { userId: string }) {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const m = await getMyMentorships(userId);
      setMentorships(m);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  if (mentorships.length === 0) {
    return (
      <Card className="shadow-sm border-border max-w-2xl mx-auto p-8 text-center">
        <p className="text-muted-foreground">No active mentorship connections. Find a mentor or become one!</p>
      </Card>
    );
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      ended: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return <Badge className={colors[status] || ""}>{status}</Badge>;
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {mentorships.map((m) => (
        <Card key={m.id} className="shadow-sm border-border">
          <CardContent className="py-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">
                  {m.mentorId === userId ? "You are mentoring" : "You are being mentored"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {m.message || "No message"}
                </p>
              </div>
              {statusBadge(m.status)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
