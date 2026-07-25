import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Projects — AABP",
  description: "Explore ongoing and completed cross-border research projects across medicine, technology, finance, and engineering — collaborations between UK and Azerbaijan professionals.",
  openGraph: {
    title: "Research Projects — AABP",
    description: "Explore cross-border research projects by AABP members — collaborations between UK and Azerbaijan professionals in medicine, technology, finance, and engineering.",
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
