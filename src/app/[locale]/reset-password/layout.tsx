import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your AABP Member Portal password.",
  openGraph: {
    title: "Reset Password — AABP",
    description: "Reset your AABP Member Portal password.",
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
