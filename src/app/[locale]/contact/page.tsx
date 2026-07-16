import type { Metadata } from "next";
import { ContactClient } from "./_client";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the AABP team. Email: contact@aabporg.uk | Phone: +44 7454 776856 | London, United Kingdom.",
};

export default function ContactPage() {
  return <ContactClient />;
}
