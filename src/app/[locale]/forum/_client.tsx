"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/shared/Hero";
import { Section, SectionHeader } from "@/components/shared/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Plus, MessageSquare, Calendar, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/firebase/useAuth";
import { getTopics, createTopic, FORUM_CATEGORIES, ForumTopic, FirestoreTimestamp } from "@/lib/firebase/db-forum";
import { toast } from "sonner";

export function ForumClient() {
  const { user } = useAuth();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getTopics(activeCategory === "All" ? undefined : activeCategory);
      setTopics(data);
      setIsLoading(false);
    })();
  }, [activeCategory]);

  const handleCreateTopic = async () => {
    if (!user) return toast.error("Please sign in to create a topic.");
    if (!title || !content) return toast.error("Title and content are required.");

    setCreating(true);
    try {
      const authorName = user.displayName || "Member";
      await createTopic({ title, content, category, authorId: user.uid, authorName });
      toast.success("Topic created!");
      setIsNewTopicOpen(false);
      setTitle("");
      setContent("");
      setCategory("General");
      const data = await getTopics(activeCategory === "All" ? undefined : activeCategory);
      setTopics(data);
    } catch {
      toast.error("Failed to create topic.");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (ts: FirestoreTimestamp | undefined) => {
    if (!ts) return "";
    const d = typeof ts === "object" && "toDate" in ts ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title="Forum"
        subtitle="Engage in discussions with fellow members across various disciplines."
        backgroundImage="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <Section className="bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <SectionHeader title="Discussions" subtitle="Browse topics and join the conversation" />
            {user && (
              <Button onClick={() => setIsNewTopicOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> New Topic
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={activeCategory === "All" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveCategory("All")}
            >
              All
            </Button>
            {FORUM_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <Dialog open={isNewTopicOpen} onOpenChange={setIsNewTopicOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Topic title" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {FORUM_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your topic content..." className="h-32" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateTopic} disabled={creating}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Topic
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No topics yet. Be the first to start a discussion!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <Link key={topic.id} href={`/forum/${topic.id}`} className="block">
                  <Card className="shadow-sm border-border hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {topic.authorName}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(topic.createdAt)}</span>
                            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {topic.replyCount} replies</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 ml-4 shrink-0">
                          <Badge variant="secondary" className="text-xs">{topic.category}</Badge>
                          {topic.lastReplyAt && (
                            <span className="text-xs text-muted-foreground">
                              Last: {formatDate(topic.lastReplyAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
