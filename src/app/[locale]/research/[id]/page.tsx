import type { Metadata } from "next";
import { getResearchById } from "@/lib/firebase/db-research";
import { ResearchDetailsClient } from "./_client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const research = await getResearchById(id);
  return {
    title: research?.title ?? "Research",
    description: research?.abstract
      ? research.abstract.slice(0, 160)
      : "AABP research publication — explore cross-border academic collaboration between the UK and Azerbaijan.",
  };
}

export default function ResearchDetailsPage() {
  return <ResearchDetailsClient />;
}
