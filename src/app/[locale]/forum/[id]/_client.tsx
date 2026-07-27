"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Section } from "@/components/shared/Section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Send, User, Calendar, MessageSquare } from "lucide-react";
import { useAuth } from "@/lib/firebase/useAuth";
import { getTopic, createReply, ForumTopic, ForumReply, FirestoreTimestamp } from "@/lib/firebase/db-forum";
import { toast } from "sonner";

export function ForumTopicClient() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<{ topic: ForumTopic; replies: ForumReply[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchTopicData = useCallback(async () => {
    if (!params.id || typeof params.id !== "string") return;
    const result = await getTopic(params.id);
    setData(result);
    setIsLoading(false);
  }, [params.id]);

  useEffect(() => {
    void Promise.resolve().then(fetchTopicData);
  }, [fetchTopicData]);

  const handleReply = async () => {
    if (!user) return toast.error("Please sign in to reply.");
    if (!replyContent.trim()) return toast.error("Please write a reply.");
    if (!data?.topic.id) return;

    setReplying(true);
    try {
      await createReply({
        topicId: data.topic.id,
        content: replyContent,
        authorId: user.uid,
        authorName: user.displayName || "Member",
      });
      toast.success("Reply posted!");
      setReplyContent("");
      await fetchTopicData();
    } catch {
      toast.error("Failed to post reply.");
    } finally {
      setReplying(false);
    }
  };

  const formatDate = (ts: FirestoreTimestamp | undefined) => {
    if (!ts) return "";
    const d = typeof ts === "object" && "toDate" in ts ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background pt-32 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif text-foreground mb-4">Topic not found</h1>
        <Button variant="outline" onClick={() => router.push("/forum")}>Back to Forum</Button>
      </main>
    );
  }

  const { topic, replies } = data;

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <Section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.push("/forum")} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Forum
          </button>

          <Card className="shadow-sm border-border mb-8">
            <CardContent className="py-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">{topic.category}</Badge>
              </div>
              <h1 className="text-2xl font-bold font-serif text-foreground mb-4">{topic.title}</h1>
              <p className="text-foreground/80 whitespace-pre-wrap mb-4">{topic.content}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {topic.authorName}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(topic.createdAt)}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {replies.length} replies</span>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-xl font-bold font-serif text-foreground mb-6">
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </h2>

          <div className="space-y-4 mb-8">
            {replies.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No replies yet. Be the first to respond!</p>
            ) : (
              replies.map((reply) => (
                <Card key={reply.id} className="shadow-sm border-border">
                  <CardContent className="py-4">
                    <p className="text-foreground/80 whitespace-pre-wrap mb-3">{reply.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {reply.authorName}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(reply.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {user ? (
            <Card className="shadow-sm border-border">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground mb-3">Write a Reply</h3>
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="mb-3 h-24"
                />
                <Button onClick={handleReply} disabled={replying}>
                  {replying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  <Send className="w-4 h-4 mr-2" /> Post Reply
                </Button>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Please sign in to join the discussion.
            </p>
          )}
        </div>
      </Section>
    </main>
  );
}
