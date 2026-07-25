import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — AABP",
  description: "Sign in to the AABP Member Portal to access your dashboard, registered events, network connections, and exclusive member benefits.",
  openGraph: {
    title: "Sign In — AABP",
    description: "Sign in to the AABP Member Portal — access your dashboard, events, network connections, and exclusive member benefits.",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
