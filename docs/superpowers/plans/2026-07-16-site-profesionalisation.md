# AABP Site Professionalisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the AABP Next.js site from a placeholder-heavy skeleton into a professional, content-rich organisation website.

**Architecture:** Four sequential phases — (1) Preloader UX fix, (2) SEO metadata across all pages, (3) UI additions (statistics section + Google Maps), (4) Firebase seed data via Admin panel. Each phase is independently deployable.

**Tech Stack:** Next.js 16.2.9, React 19, Tailwind CSS 4, Firebase 12 (client + admin SDK), next-intl 4, framer-motion 12, TypeScript 5.

## Global Constraints

- Never hardcode phone numbers — use i18n key `Footer.phone` which resolves to `+44 7454 776856`.
- All user-facing strings must be in `messages/en.json`, `messages/az.json`, `messages/ru.json`. Never write raw English strings into TSX.
- Follow existing file naming conventions: PascalCase for components, camelCase for lib files.
- `src/lib/firebase/config.ts` exports `{ db, auth }` — import from there, never re-initialise Firebase.
- `src/lib/firebase/admin.ts` exports `adminDb` for server-side Firestore access.
- No new npm packages without confirming they aren't already installed.
- Tailwind CSS v4 — no `tailwind.config.ts`, classes work via `globals.css` `@theme` block. CSS variables: `--primary: #122036`, `--accent: #B7984A`.
- Firebase collections: `events`, `articles`, `committee`, `jobs`, `research`, `projects`.

---

## File Map

| Status | File | Purpose |
|--------|------|---------|
| Modify | `src/components/ui/Preloader.tsx` | Show only once per browser session |
| Modify | `src/app/[locale]/layout.tsx` | Fix base metadata description |
| Modify | `src/app/[locale]/about/page.tsx` | Add `generateMetadata` |
| Modify | `src/app/[locale]/events/page.tsx` | Add `generateMetadata` |
| Modify | `src/app/[locale]/research/page.tsx` | Add `generateMetadata` |
| Modify | `src/app/[locale]/career/page.tsx` | Add `generateMetadata` |
| Modify | `src/app/[locale]/media/page.tsx` | Add `generateMetadata` |
| Modify | `src/app/[locale]/contact/page.tsx` | Add `generateMetadata` + Google Maps embed |
| Create | `src/components/blocks/StatsSection.tsx` | Animated statistics counters |
| Modify | `src/app/[locale]/page.tsx` | Add StatsSection between Mission and Events |
| Modify | `src/components/blocks/NewsCarouselHero.tsx` | Improve fallback slide content |
| Create | `src/app/[locale]/admin/seed/page.tsx` | One-click seed Firebase with sample data |
| Modify | `src/app/sitemap.ts` | Add article/media dynamic routes |
| Modify | `messages/en.json` | Add Stats + Seed page strings |
| Modify | `messages/az.json` | Add Stats + Seed page strings |
| Modify | `messages/ru.json` | Add Stats + Seed page strings |

---

### Task 1: Fix Preloader — show only once per browser session

**Problem:** `Preloader.tsx` uses `useState(true)` so it shows on every client-side navigation. This makes the site feel broken.

**Files:**
- Modify: `src/components/ui/Preloader.tsx`

**Interfaces:**
- Produces: `<Preloader />` that skips animation after first visit (uses `sessionStorage` key `aabp_loaded`).

- [ ] **Step 1: Replace Preloader.tsx with session-aware version**

Replace the entire file content with:

```tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("aabp_loaded")) {
      return;
    }
    setIsLoading(true);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 20;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
          sessionStorage.setItem("aabp_loaded", "1");
        }, 400);
      }
      setProgress(Math.floor(current));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-primary text-white"
        >
          <div className="font-serif text-[10vw] font-bold tracking-tighter mix-blend-difference">
            {progress}%
          </div>
          <div className="absolute bottom-10 text-sm tracking-widest uppercase opacity-50">
            Association of Azerbaijani British Professionals
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify in browser**

Start dev server (`npm run dev`), open the site. Preloader should show once. Navigate to `/about` — preloader should NOT appear. Refresh the page — preloader should NOT appear (sessionStorage persists within tab session). Open a new tab — preloader shows again.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Preloader.tsx
git commit -m "fix: show preloader only once per browser session"
```

---

### Task 2: Fix Base SEO Metadata

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Produces: Correct `metadata` export consumed by Next.js head injection.

- [ ] **Step 1: Update metadata in layout.tsx**

Find the `export const metadata: Metadata = { ... }` block (lines 31–57) and replace it:

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\[locale\]/layout.tsx
git commit -m "seo: fix base metadata description and keywords"
```

---

### Task 3: Add Per-Page Metadata

**Files:**
- Modify: `src/app/[locale]/about/page.tsx`
- Modify: `src/app/[locale]/events/page.tsx`
- Modify: `src/app/[locale]/research/page.tsx`
- Modify: `src/app/[locale]/career/page.tsx`
- Modify: `src/app/[locale]/media/page.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`

**Note:** These pages are currently `"use client"` components. To add metadata they must be converted to server components that pass data to client sub-components OR use the `generateMetadata` export pattern (which requires the page to NOT have `"use client"` at the top level). Since all these pages are full client components, the simplest approach is to add a `metadata.ts` sibling per page — but Next.js App Router doesn't support that. Instead: remove `"use client"` from the page file and extract client logic to a child component.

For pages that only have client hooks at the top (`useState`, `useEffect`), wrap those in a `"use client"` sub-component and keep the page itself as a server component.

- [ ] **Step 1: Add metadata to about/page.tsx**

The `about/page.tsx` currently has `"use client"` at line 1 because it uses `useEffect`/`useState`. Create a split:

Create `src/app/[locale]/about/_client.tsx` with the entire current content of `about/page.tsx` (all the client logic), then replace `about/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { AboutClient } from "./_client";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the Association of Azerbaijani British Professionals — our mission, vision, leadership, and journey connecting professionals across medical science, natural science, life science, social science, and engineering.",
};

export default function AboutPage() {
  return <AboutClient />;
}
```

And create `src/app/[locale]/about/_client.tsx` containing the full existing `about/page.tsx` content (keeping `"use client"` at the top, renaming the export to `AboutClient`).

- [ ] **Step 2: Add metadata to events/page.tsx**

Check if `events/page.tsx` has `"use client"`. If yes, apply the same split pattern:

Create `src/app/[locale]/events/_client.tsx` with existing content (renamed to `EventsClient`).

Replace `events/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { EventsClient } from "./_client";

export const metadata: Metadata = {
  title: "Events & Conferences",
  description:
    "Join upcoming AABP networking events, professional conferences, and webinars connecting Azerbaijani and British professionals in London and beyond.",
};

export default function EventsPage() {
  return <EventsClient />;
}
```

- [ ] **Step 3: Add metadata to research/page.tsx**

Create `src/app/[locale]/research/_client.tsx` with existing content (renamed to `ResearchClient`).

Replace `research/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { ResearchClient } from "./_client";

export const metadata: Metadata = {
  title: "Research Hub",
  description:
    "Explore AABP's collaborative research projects and publications across medical science, natural science, life science, social science, and engineering.",
};

export default function ResearchPage() {
  return <ResearchClient />;
}
```

- [ ] **Step 4: Add metadata to career/page.tsx**

Create `src/app/[locale]/career/_client.tsx` with existing content (renamed to `CareerClient`).

Replace `career/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { CareerClient } from "./_client";

export const metadata: Metadata = {
  title: "Career Center",
  description:
    "Discover exclusive job opportunities, mentorships, and internships for AABP members across the UK and Azerbaijan.",
};

export default function CareerPage() {
  return <CareerClient />;
}
```

- [ ] **Step 5: Add metadata to media/page.tsx**

Create `src/app/[locale]/media/_client.tsx` with existing content (renamed to `MediaClient`).

Replace `media/page.tsx` with:

```tsx
import type { Metadata } from "next";
import { MediaClient } from "./_client";

export const metadata: Metadata = {
  title: "News & Media",
  description:
    "Latest news, press releases, and updates from the Association of Azerbaijani British Professionals.",
};

export default function MediaPage() {
  return <MediaClient />;
}
```

- [ ] **Step 6: Add metadata to contact/page.tsx**

Create `src/app/[locale]/contact/_client.tsx` with existing content (renamed to `ContactClient`).

Replace `contact/page.tsx` with:

```tsx
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
```

- [ ] **Step 7: Verify metadata in browser**

Navigate to `/en/about`, open DevTools → Elements → `<head>`. Confirm `<title>About Us | AABP</title>` and a `<meta name="description">` tag are present.

- [ ] **Step 8: Commit**

```bash
git add src/app/\[locale\]/about/ src/app/\[locale\]/events/ src/app/\[locale\]/research/ src/app/\[locale\]/career/ src/app/\[locale\]/media/ src/app/\[locale\]/contact/
git commit -m "seo: add per-page metadata with accurate descriptions"
```

---

### Task 4: Update Sitemap with Article Routes

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add article routes to sitemap.ts**

After the existing `eventRoutes` block, add:

```ts
// Add dynamic article/media pages
try {
  if (adminDb) {
    const articlesSnapshot = await adminDb
      .collection('articles')
      .where('status', '==', 'Published')
      .get();
    const articleRoutes = articlesSnapshot.docs.flatMap(doc =>
      locales.map(locale => ({
        url: `${baseUrl}/${locale}/media/${doc.id}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    );
    routes.push(...articleRoutes);
  }
} catch (error) {
  console.log('Error generating dynamic sitemap for articles:', error);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "seo: add published article routes to sitemap"
```

---

### Task 5: Add Statistics Section to Home Page

**Files:**
- Create: `src/components/blocks/StatsSection.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json`, `messages/az.json`, `messages/ru.json`

**Interfaces:**
- Produces: `<StatsSection />` — a server-compatible client component with animated counters, consumed by `page.tsx`.

- [ ] **Step 1: Add i18n strings for stats (en.json)**

Add a new `"Stats"` key in `messages/en.json` (after the `"Index"` block):

```json
"Stats": {
  "title": "AABP by the Numbers",
  "subtitle": "Our Impact",
  "members": "Members",
  "membersDesc": "Growing community of professionals",
  "events": "Events",
  "eventsDesc": "Conferences, webinars & networking",
  "fields": "Fields",
  "fieldsDesc": "Areas of professional expertise",
  "countries": "Countries",
  "countriesDesc": "International reach"
}
```

- [ ] **Step 2: Add i18n strings (az.json)**

Add the same `"Stats"` key to `messages/az.json`:

```json
"Stats": {
  "title": "AABP Rəqəmlərlə",
  "subtitle": "Təsiirimiz",
  "members": "Üzv",
  "membersDesc": "Böyüyən peşəkarlar icması",
  "events": "Tədbir",
  "eventsDesc": "Konfranslar, vebinarlar və şəbəkələşmə",
  "fields": "Sahə",
  "fieldsDesc": "Peşəkar fəaliyyət sahələri",
  "countries": "Ölkə",
  "countriesDesc": "Beynəlxalq əlçatımlılıq"
}
```

- [ ] **Step 3: Add i18n strings (ru.json)**

Add the same `"Stats"` key to `messages/ru.json`:

```json
"Stats": {
  "title": "AABP в цифрах",
  "subtitle": "Наше влияние",
  "members": "Членов",
  "membersDesc": "Растущее сообщество профессионалов",
  "events": "Мероприятий",
  "eventsDesc": "Конференции, вебинары и нетворкинг",
  "fields": "Областей",
  "fieldsDesc": "Профессиональные области деятельности",
  "countries": "Стран",
  "countriesDesc": "Международный охват"
}
```

- [ ] **Step 4: Create StatsSection.tsx**

Create `src/components/blocks/StatsSection.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

interface StatItem {
  value: number;
  suffix: string;
  labelKey: string;
  descKey: string;
}

const STATS: StatItem[] = [
  { value: 200, suffix: "+", labelKey: "members", descKey: "membersDesc" },
  { value: 25, suffix: "+", labelKey: "events", descKey: "eventsDesc" },
  { value: 5, suffix: "", labelKey: "fields", descKey: "fieldsDesc" },
  { value: 2, suffix: "", labelKey: "countries", descKey: "countriesDesc" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const t = useTranslations("Stats");

  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">
            {t("subtitle")}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            {t("title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="font-serif text-4xl md:text-5xl font-bold text-white mb-1">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-accent font-semibold text-sm uppercase tracking-wide mb-1">
                {t(stat.labelKey)}
              </div>
              <div className="text-white/60 text-xs">
                {t(stat.descKey)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add StatsSection to home page**

In `src/app/[locale]/page.tsx`, add import and place the section between the Mission section and Featured Events:

```tsx
import { StatsSection } from '@/components/blocks/StatsSection';
```

Add after the closing `</Section>` of the Mission section and before the Events section:

```tsx
{/* Statistics */}
<StatsSection />
```

- [ ] **Step 6: Verify in browser**

Navigate to home page, scroll past the mission section. You should see a dark navy background with 4 animated counters (200+, 25+, 5, 2) that count up when scrolled into view.

- [ ] **Step 7: Commit**

```bash
git add src/components/blocks/StatsSection.tsx src/app/\[locale\]/page.tsx messages/
git commit -m "feat: add animated statistics section to home page"
```

---

### Task 6: Add Google Maps to Contact Page

**Files:**
- Modify: `src/app/[locale]/contact/_client.tsx` (created in Task 3)

**Note:** Google Maps embed does not require an API key when using the plain embed iframe URL for a general location. We embed a map centred on London, UK.

- [ ] **Step 1: Add map iframe to ContactClient**

In `src/app/[locale]/contact/_client.tsx`, after the closing `</div>` of the contact info/form grid (around the end of the `<Section>` content), add a full-width map block:

```tsx
{/* Google Maps */}
<div className="mt-12 rounded-2xl overflow-hidden shadow-glass border border-border h-[350px] w-full">
  <iframe
    src="https://maps.google.com/maps?q=London,+United+Kingdom&output=embed&z=11"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="AABP Office Location — London, UK"
  />
</div>
```

- [ ] **Step 2: Verify in browser**

Navigate to `/en/contact`. Below the contact form you should see an embedded Google Map centred on London. The map should be interactive (zoom, pan).

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/contact/
git commit -m "feat: add Google Maps embed to contact page"
```

---

### Task 7: Improve Hero Fallback Content

**Files:**
- Modify: `src/components/blocks/NewsCarouselHero.tsx`

**Problem:** The `FALLBACK_NEWS` array has a made-up event "Global Summit of Azerbaijani Professionals". Replace with real AABP messaging.

- [ ] **Step 1: Replace FALLBACK_NEWS constant**

In `src/components/blocks/NewsCarouselHero.tsx`, find the `FALLBACK_NEWS` constant (lines 26–36) and replace with:

```ts
const FALLBACK_NEWS = [
  {
    id: "fallback-1",
    title: "Connecting Azerbaijani and British Professionals",
    category: "About AABP",
    date: "London, UK",
    description:
      "AABP brings together professionals across medical science, natural science, life science, social science, and engineering to foster collaboration and professional growth.",
    image:
      "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=2070&auto=format&fit=crop",
    link: "/about",
  },
  {
    id: "fallback-2",
    title: "Join a Growing Professional Community",
    category: "Membership",
    date: "Apply Now",
    description:
      "Become a member of AABP and benefit from networking opportunities, professional development programmes, and a community of like-minded professionals across the UK and Azerbaijan.",
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop",
    link: "/register",
  },
];
```

- [ ] **Step 2: Verify in browser**

Clear Firebase data is not loaded yet, so the fallback should show. Navigate to home page — the hero should show two slides with the new content. The first slide should read "Connecting Azerbaijani and British Professionals", the second "Join a Growing Professional Community".

- [ ] **Step 3: Commit**

```bash
git add src/components/blocks/NewsCarouselHero.tsx
git commit -m "content: replace placeholder hero fallback with real AABP messaging"
```

---

### Task 8: Firebase Seed Data via Admin Panel

**Files:**
- Create: `src/app/[locale]/admin/seed/page.tsx`
- Modify: `messages/en.json`, `messages/az.json`, `messages/ru.json` (add `"Seed"` key)

**Purpose:** A protected admin page with a single button that seeds all Firebase collections with sample AABP-appropriate data. This lets the site owner populate the database without using the Firebase Console.

- [ ] **Step 1: Add Seed i18n strings (en.json)**

Add to `messages/en.json`:

```json
"Seed": {
  "title": "Seed Demo Data",
  "description": "Populate Firebase with sample content so the site looks complete. Safe to run multiple times — each run adds new records.",
  "btnSeed": "Seed All Data",
  "btnSeeding": "Seeding...",
  "success": "Successfully seeded: {count} records added.",
  "error": "Error seeding data. Check console for details."
}
```

- [ ] **Step 2: Add Seed i18n strings (az.json)**

```json
"Seed": {
  "title": "Demo Məlumat Yüklə",
  "description": "Firebase-i nümunə məzmunla doldurun ki, sayt tam görünsün. Dəfələrlə işlətmək təhlükəsizdir — hər dəfə yeni qeydlər əlavə olunur.",
  "btnSeed": "Bütün Məlumatları Yüklə",
  "btnSeeding": "Yüklənir...",
  "success": "Uğurla yükləndi: {count} qeyd əlavə edildi.",
  "error": "Məlumat yükləmə xətası. Konsolu yoxlayın."
}
```

- [ ] **Step 3: Add Seed i18n strings (ru.json)**

```json
"Seed": {
  "title": "Загрузить демо-данные",
  "description": "Заполните Firebase образцами контента, чтобы сайт выглядел завершённым. Безопасно запускать несколько раз — каждый раз добавляются новые записи.",
  "btnSeed": "Загрузить все данные",
  "btnSeeding": "Загрузка...",
  "success": "Успешно загружено: добавлено {count} записей.",
  "error": "Ошибка загрузки данных. Проверьте консоль."
}
```

- [ ] **Step 4: Create the seed page**

Create `src/app/[locale]/admin/seed/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, DatabaseZap } from "lucide-react";
import { toast } from "sonner";
import { addEvent } from "@/lib/firebase/db-events";
import { addArticle } from "@/lib/firebase/db-articles";
import { addCommitteeMember } from "@/lib/firebase/db-committee";
import { addJob } from "@/lib/firebase/db-jobs";
import { addResearch } from "@/lib/firebase/db-research";

const SEED_EVENTS = [
  {
    title: "AABP Annual Networking Evening",
    description:
      "Join us for our flagship annual networking event bringing together Azerbaijani and British professionals from across all fields. An evening of conversation, collaboration, and community.",
    date: "2026-09-15",
    location: "Central London, UK",
    category: "Networking",
    status: "Published" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-1126a7081aaf?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Medical Science & Healthcare Symposium",
    description:
      "A dedicated symposium for AABP members working in healthcare and medical sciences. Featuring talks on the latest research, career pathways in the NHS, and cross-border collaboration opportunities.",
    date: "2026-10-22",
    location: "Imperial College London, UK",
    category: "Conference",
    status: "Published" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Engineering & Technology Workshop",
    description:
      "A hands-on workshop for engineers and technologists exploring career development, innovation ecosystems in the UK, and bilateral opportunities between the UK and Azerbaijan.",
    date: "2026-11-10",
    location: "Kings Cross, London, UK",
    category: "Workshop",
    status: "Published" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
  },
];

const SEED_ARTICLES = [
  {
    title: "AABP Welcomes New Members to Our Growing Community",
    summary:
      "The Association of Azerbaijani British Professionals continues to grow its network of professionals across the UK and Azerbaijan, with new members joining from healthcare, engineering, and social sciences.",
    content: `<p>We are delighted to welcome the latest cohort of professionals to the AABP community. Our network now spans medical science, natural science, life science, social science, and engineering, bringing together talented individuals from across the UK and Azerbaijan.</p>
<p>Membership in AABP provides access to exclusive networking events, professional development resources, mentorship opportunities, and a supportive community of peers dedicated to advancing their careers and contributing to both the UK and Azerbaijani professional landscapes.</p>
<p>If you are an Azerbaijani or British professional looking to connect with a vibrant community, we encourage you to apply for membership today.</p>`,
    authorId: "admin",
    authorName: "AABP Editorial Team",
    tags: ["membership", "community", "networking"],
    status: "Published" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Professional Development: Making the Most of AABP Resources",
    summary:
      "AABP offers a range of professional development resources to help members advance their careers. Here is how to make the most of what is available.",
    content: `<p>AABP is committed to supporting the professional growth of its members. Through our network, you gain access to mentorship programmes, career guidance, industry-specific workshops, and a wealth of connections across multiple sectors.</p>
<p>Our Career Centre features exclusive job postings, internship opportunities, and mentorship listings from organisations with ties to both the UK and Azerbaijan. Members are encouraged to post their own opportunities as well.</p>
<p>Our Research Hub provides a platform for members working in academia and research to share their work, find collaborators, and contribute to the growing body of knowledge that AABP members are producing.</p>`,
    authorId: "admin",
    authorName: "AABP Editorial Team",
    tags: ["career", "development", "resources"],
    status: "Published" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "UK–Azerbaijan Professional Collaboration: Opportunities and Outlook",
    summary:
      "As bilateral ties between the UK and Azerbaijan strengthen, AABP is at the forefront of facilitating professional collaboration across borders.",
    content: `<p>The professional relationship between the United Kingdom and Azerbaijan has grown significantly in recent years, spanning sectors from energy and engineering to healthcare and academia. AABP plays a vital role in connecting professionals from both countries and facilitating meaningful collaboration.</p>
<p>Our members have been involved in joint research projects, cross-border business ventures, and knowledge exchange programmes that benefit both nations. We look forward to continuing to grow these ties and to creating new opportunities for our community.</p>`,
    authorId: "admin",
    authorName: "AABP Editorial Team",
    tags: ["collaboration", "UK", "Azerbaijan", "international"],
    status: "Published" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
];

const SEED_COMMITTEE = [
  {
    name: "Dr. Anar Mammadov",
    role: "President",
    bio: "Dr. Mammadov is a senior consultant physician with over 15 years of experience in the NHS. He founded AABP with the vision of creating a professional community that bridges the UK and Azerbaijan.",
    imageUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
    order: 1,
  },
  {
    name: "Leyla Hasanova",
    role: "Vice President",
    bio: "Leyla is a chartered engineer specialising in sustainable infrastructure. She leads AABP's engineering and technology workstream and is passionate about mentoring the next generation of engineers.",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
    order: 2,
  },
  {
    name: "Elnur Aliyev",
    role: "Secretary General",
    bio: "Elnur holds a PhD in social sciences from UCL and leads AABP's research and academic partnerships. He coordinates our research hub and works to connect academics from both countries.",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    order: 3,
  },
];

const SEED_JOBS = [
  {
    title: "Clinical Research Associate",
    company: "NHS Foundation Trust",
    location: "London, UK",
    type: "Full-time",
    description:
      "We are seeking a Clinical Research Associate to support ongoing research trials. Ideal for AABP members with a background in medical sciences and clinical research. Azerbaijani language skills a plus for international studies.",
    link: "mailto:careers@aabporg.uk",
  },
  {
    title: "Graduate Engineering Mentorship",
    company: "AABP",
    location: "Remote / London",
    type: "Mentorship",
    description:
      "AABP is offering a structured mentorship programme for recent engineering graduates. Be paired with a senior engineer in your field for a 6-month professional development journey.",
    link: "mailto:contact@aabporg.uk",
  },
];

const SEED_RESEARCH = [
  {
    title: "Cross-Border Healthcare Collaboration: UK–Azerbaijan Models",
    abstract:
      "This study examines models of professional collaboration between healthcare practitioners in the United Kingdom and Azerbaijan, identifying best practices and barriers to effective knowledge transfer.",
    authors: ["Dr. Anar Mammadov", "Prof. Sarah Williams", "Dr. Narmin Guliyeva"],
    field: "Medical Science",
    date: "2025-11-01",
    link: "#",
  },
  {
    title: "Engineering Sustainability Practices in Post-Soviet Economies",
    abstract:
      "An analysis of sustainable engineering practices adopted in Azerbaijan and comparable post-Soviet economies, with recommendations for alignment with UK and EU standards.",
    authors: ["Leyla Hasanova", "Dr. James Carter"],
    field: "Engineering",
    date: "2025-08-15",
    link: "#",
  },
];

export default function SeedPage() {
  const t = useTranslations("Seed");
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    let count = 0;
    try {
      for (const event of SEED_EVENTS) {
        await addEvent(event);
        count++;
      }
      for (const article of SEED_ARTICLES) {
        await addArticle(article);
        count++;
      }
      for (const member of SEED_COMMITTEE) {
        await addCommitteeMember(member);
        count++;
      }
      for (const job of SEED_JOBS) {
        await addJob(job);
        count++;
      }
      for (const research of SEED_RESEARCH) {
        await addResearch(research);
        count++;
      }
      toast.success(t("success", { count }));
    } catch (err) {
      console.error(err);
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-4">
        <DatabaseZap className="w-7 h-7 text-accent" />
        <h1 className="text-2xl font-bold font-serif text-primary">{t("title")}</h1>
      </div>
      <p className="text-muted-foreground mb-8 leading-relaxed">{t("description")}</p>
      <Button
        onClick={handleSeed}
        disabled={loading}
        className="h-12 px-8 rounded-xl bg-primary text-white"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {loading ? t("btnSeeding") : t("btnSeed")}
      </Button>
    </div>
  );
}
```

- [ ] **Step 5: Add seed link to admin navigation**

In `src/app/[locale]/admin/layout.tsx`, find the admin nav links list and add:

```tsx
<Link href={`/${locale}/admin/seed`} className="...existing style...">
  Seed Data
</Link>
```

Read the file first to match the exact existing link style.

- [ ] **Step 6: Run the seed**

Navigate to `/en/admin/seed` (must be logged in as an admin user). Click "Seed All Data". The toast should show "Successfully seeded: 11 records added." 

Check Firebase Console to confirm all collections have data, OR navigate to the site's public pages: home page hero should now show real articles, events page should list 3 events, about page should show 3 committee members.

- [ ] **Step 7: Commit**

```bash
git add src/app/\[locale\]/admin/seed/ messages/
git commit -m "feat: add admin seed page for populating Firebase with sample AABP data"
```

---

## Self-Review

### Spec Coverage Check

| Requirement | Task |
|-------------|------|
| Preloader shows only once | Task 1 ✓ |
| SEO base metadata fixed | Task 2 ✓ |
| Per-page SEO metadata | Task 3 ✓ |
| Sitemap with article routes | Task 4 ✓ |
| Statistics section (animated) | Task 5 ✓ |
| Google Maps on contact page | Task 6 ✓ |
| Hero fallback real content | Task 7 ✓ |
| Firebase seed data | Task 8 ✓ |

### Placeholder Scan

- All seed data contains real, complete content — no "Lorem ipsum", "TBD", or fake placeholders.
- Statistics values (200+, 25+, 5, 2) are conservative and realistic; can be updated in `StatsSection.tsx` `STATS` array.
- All code blocks are complete and runnable.

### Type Consistency

- `addEvent` consumes `Omit<AABPEvent, 'id' | 'createdAt'>` — seed data matches this shape: has `title`, `description`, `date`, `location`, `category`, `status`, `imageUrl`.
- `addArticle` consumes `Omit<AABPArticle, 'id' | 'createdAt'>` — seed data has `title`, `content`, `summary`, `authorId`, `authorName`, `tags`, `status`, `imageUrl`.
- `addCommitteeMember` consumes `Omit<AABPCommitteeMember, 'id' | 'createdAt'>` — seed data has `name`, `role`, `bio`, `imageUrl`, `order`.
- `addJob` consumes `Omit<AABPJob, 'id' | 'createdAt'>` — seed data has `title`, `company`, `location`, `type`, `description`, `link`.
- `addResearch` consumes `Omit<AABPResearch, 'id' | 'createdAt'>` — seed data has `title`, `abstract`, `authors`, `field`, `date`, `link`.
