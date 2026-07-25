import type { Metadata } from "next";
import { ResearchClient } from "./_client";

export const metadata: Metadata = {
  title: "Research Hub",
  description:
    "Explore AABP's collaborative research projects and publications across medical science, natural science, life science, social science, and engineering.",
  openGraph: {
    title: "Research Hub — AABP",
    description:
      "Explore AABP's collaborative research projects and publications across five key disciplines, connecting UK and Azerbaijan academics.",
  },
};

export default function ResearchPage() {
  return <ResearchClient />;
}
