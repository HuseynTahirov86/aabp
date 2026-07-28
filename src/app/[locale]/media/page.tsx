import type { Metadata } from "next";
import { MediaClient } from "./_client";

export const metadata: Metadata = {
  title: "News & Media",
  description:
    "Latest news, press releases, and updates from the Association of Azerbaijani British Professionals.",
  openGraph: {
    title: "News & Media — AABP",
    description:
      "Latest news, press releases, and updates from the Association of Azerbaijani British Professionals.",
  },
};

export default function MediaPage() {
  return <MediaClient />;
}
