import type { Metadata } from "next";
import { Inter, Merriweather, Caveat } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BackToTop } from "@/components/ui/BackToTop";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { Preloader } from "@/components/ui/Preloader";
import { JsonLd } from "@/components/shared/JsonLd";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AABP | Association of Azerbaijan British Professionals",
    template: "%s | AABP",
  },
  description:
    "Connecting Azerbaijan and British professionals across medical science, natural science, life science, social science, and engineering. Based in London, UK.",
  keywords: [
    "Azerbaijan professionals",
    "British professionals",
    "AABP",
    "Azerbaijan UK",
    "professional association",
    "networking London",
    "medical science",
    "engineering",
  ],
  openGraph: {
    title: "Association of Azerbaijan British Professionals",
    description:
      "Connecting Azerbaijan and British professionals across medical science, natural science, life science, social science, and engineering.",
    url: "https://aabporg.uk",
    siteName: "AABP",
    images: [
      {
        url: "https://aabporg.uk/og-image.png",
        width: 1200,
        height: 630,
        alt: "AABP — Association of Azerbaijan British Professionals",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "AABP | Association of Azerbaijan British Professionals",
    description:
      "Connecting Azerbaijan and British professionals across medical science, natural science, life science, social science, and engineering.",
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

  const baseUrl = "https://aabporg.uk";

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${merriweather.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="canonical" href={`${baseUrl}/${locale}`} />
        {routing.locales.map((alt) => (
          <link
            key={alt}
            rel="alternate"
            hrefLang={alt}
            href={`${baseUrl}/${alt}`}
          />
        ))}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Association of Azerbaijan British Professionals",
            alternateName: "AABP",
            url: "https://aabporg.uk",
            email: "contact@aabporg.uk",
            telephone: "+44 7454 776856",
            foundingDate: "2015",
            description:
              "Connecting Azerbaijan and British professionals across medical science, natural science, life science, social science, and engineering.",
            sameAs: ["https://uk.linkedin.com/company/association-of-azerbaijani-british-professionals", "https://instagram.com/aabporg_uk", "https://www.facebook.com/p/Association-of-Azerbaijan-British-Professionals-61565702764153/"],
            logo: "https://aabporg.uk/logo.png",
            address: {
              "@type": "PostalAddress",
              addressLocality: "London",
              addressCountry: "United Kingdom",
            },
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans pt-[72px] lg:pt-[150px] dark">
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
      </body>
    </html>
  );
}
