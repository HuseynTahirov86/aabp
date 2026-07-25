import type { Metadata } from "next";
import { AboutClient } from "./_client";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the Association of Azerbaijan British Professionals — our mission, vision, leadership, and journey connecting professionals across medical science, natural science, life science, social science, and engineering.",
};

export default function AboutPage() {
  return <AboutClient />;
}
