import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { Preloader } from "@/components/ui/Preloader";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AABP | Association of Azerbaijani British Professionals",
    template: "%s | AABP",
  },
  description:
    "Connecting Azerbaijani and British professionals across medical science, natural science, life science, social science, and engineering. Based in London, UK.",
  keywords: [
    "Azerbaijani professionals",
    "British professionals",
    "AABP",
    "Azerbaijan UK",
    "professional association",
    "networking London",
    "medical science",
    "engineering",
  ],
  openGraph: {
    title: "Association of Azerbaijani British Professionals",
    description:
      "Connecting Azerbaijani and British professionals across medical science, natural science, life science, social science, and engineering.",
    url: "https://aabporg.uk",
    siteName: "AABP",
    images: [
      {
        url: "https://aabporg.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "AABP — Association of Azerbaijani British Professionals",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "AABP | Association of Azerbaijani British Professionals",
    description:
      "Connecting Azerbaijani and British professionals across medical science, natural science, life science, social science, and engineering.",
    images: ["https://aabporg.uk/og-image.png"],
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans pt-[72px] lg:pt-[150px]">
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            <NextIntlClientProvider messages={messages} locale={locale}>
              <TooltipProvider>
                <Preloader />
                <NoiseOverlay />
                <ScrollProgress />
                <Navbar />
                <div className="flex-1">
                  {children}
                </div>
                <Footer />
                <BackToTop />
              </TooltipProvider>
              <Toaster richColors position="bottom-right" />
            </NextIntlClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
