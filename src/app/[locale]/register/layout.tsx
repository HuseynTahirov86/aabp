import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply for Membership",
  description: "Apply for AABP membership to access exclusive events, network with Azerbaijan and British professionals, and unlock member-only benefits.",
  openGraph: {
    title: "Apply for Membership — AABP",
    description: "Join the AABP network — apply for membership to access exclusive events, mentorship, and career opportunities.",
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
