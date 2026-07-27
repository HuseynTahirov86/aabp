"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { getAuthInstance } from "@/lib/firebase/config";

export default function AdminEmailPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipientFilter, setRecipientFilter] = useState<"all" | string>("all");
  const [sending, setSending] = useState(false);

  const roles = ["MEMBER", "COMMITTEE", "EDITOR", "ADMIN", "SUPER_ADMIN", "PENDING"];

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required.");
      return;
    }

    setSending(true);
    try {
      const idToken = await getAuthInstance().currentUser?.getIdToken();
      if (!idToken) {
        toast.error("You must be signed in as an admin to send emails.");
        setSending(false);
        return;
      }

      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          filter: recipientFilter === "all" ? "all" : recipientFilter,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Email sent to ${data.count} member${data.count !== 1 ? "s" : ""}.`);
        setSubject("");
        setMessage("");
      } else {
        toast.error(data.error || "Failed to send emails.");
      }
    } catch {
      toast.error("Failed to send emails.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-serif text-white">Email Members</h1>
        <p className="text-white/70 mt-2">Send bulk emails to members based on role or to all members.</p>
      </div>

      <Card className="shadow-sm border-white/10 max-w-2xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Compose Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Recipients</label>
            <select
              value={recipientFilter}
              onChange={(e) => setRecipientFilter(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="all">All Members</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="w-full rounded-lg border border-white/10 bg-background px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={8}
              className="w-full rounded-lg border border-white/10 bg-background px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent resize-y"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={sending}
            className="bg-accent text-white hover:bg-accent/90"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Send Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
