import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet the Executive Committee of the Association of Azerbaijani British Professionals — leaders from diverse sectors united by a dedication to excellence.",
  openGraph: {
    title: "Leadership — AABP",
    description: "Meet the Executive Committee leading the Association of Azerbaijani British Professionals — leaders united by a dedication to professional excellence.",
  },
};

export default function LeadershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
