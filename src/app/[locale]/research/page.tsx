import type { Metadata } from "next";
import { ResearchClient } from "./_client";

export const metadata: Metadata = {
  title: "Research Hub",
  description:
    "Explore AABP's collaborative research projects and publications across medical science, natural science, life science, social science, and engineering.",
};

export default function ResearchPage() {
  return <ResearchClient />;
}
