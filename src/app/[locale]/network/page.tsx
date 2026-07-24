import type { Metadata } from "next";
import { NetworkClient } from "./_client";

export const metadata: Metadata = {
  title: "Member Directory",
  description:
    "Browse the AABP member directory to connect with Azerbaijani and British professionals across medical science, natural science, life science, social science, and engineering.",
};

export default function NetworkPage() {
  return <NetworkClient />;
}
