import type { Metadata } from "next";
import { ResourcesClient } from "./_client";

export const metadata: Metadata = {
  title: "Resource Library",
  description:
    "Access educational materials, documents, and resources shared by the AABP community.",
  openGraph: {
    title: "Resource Library — AABP",
    description:
      "Access educational materials, documents, and resources shared by the AABP community.",
  },
};

export default function ResourcesPage() {
  return <ResourcesClient />;
}
