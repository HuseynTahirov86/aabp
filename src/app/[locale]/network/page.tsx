import type { Metadata } from "next";
import { NetworkClient } from "./_client";

export const metadata: Metadata = {
  title: "Member Directory",
  description:
    "Browse the AABP member directory to connect with Azerbaijan and British professionals across medical science, natural science, life science, social science, and engineering.",
  openGraph: {
    title: "Member Directory — AABP",
    description:
      "Browse the AABP member directory and connect with Azerbaijan and British professionals across five key disciplines.",
  },
};

export default function NetworkPage() {
  return <NetworkClient />;
}
