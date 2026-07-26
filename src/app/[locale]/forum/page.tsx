import type { Metadata } from "next";
import { ForumClient } from "./_client";

export const metadata: Metadata = {
  title: "Forum",
  description:
    "Engage in discussions with fellow AABP members across various disciplines.",
  openGraph: {
    title: "Forum — AABP",
    description:
      "Engage in discussions with fellow AABP members across various disciplines.",
  },
};

export default function ForumPage() {
  return <ForumClient />;
}
