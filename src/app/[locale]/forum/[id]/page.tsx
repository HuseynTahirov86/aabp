import type { Metadata } from "next";
import { getTopic } from "@/lib/firebase/db-forum";
import { ForumTopicClient } from "./_client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getTopic(id);
  return {
    title: data?.topic?.title ?? "Forum Topic",
    description:
      data?.topic?.content?.slice(0, 160) ??
      "Join the discussion on this AABP forum topic.",
    openGraph: {
      title: data?.topic?.title ?? "AABP Forum Topic",
      description:
        data?.topic?.content?.slice(0, 160) ??
        "Join the discussion on this AABP forum topic.",
    },
  };
}

export default function ForumTopicPage() {
  return <ForumTopicClient />;
}
