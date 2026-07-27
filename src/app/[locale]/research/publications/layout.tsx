import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description: "Discover academic and professional publications by AABP members — research papers, articles, and collaborative works across medical, natural, life, and social sciences, and engineering.",
  openGraph: {
    title: "Publications — AABP",
    description: "Discover academic publications by AABP members — research papers, articles, and collaborative works across five key disciplines.",
  },
};

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
