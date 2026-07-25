import { AABPArticle } from "../firebase/db-articles";

export const MOCK_ARTICLES: AABPArticle[] = [
  {
    id: "mock-1",
    title: "AABP Annual Medical Symposium 2026 Concludes Successfully",
    summary: "Over 300 healthcare professionals gathered in London to discuss the future of telemedicine and cross-border medical practices between the UK and Azerbaijan.",
    content: `
# AABP Annual Medical Symposium 2026

The Association of Azerbaijan British Professionals (AABP) successfully hosted its highly anticipated Medical Symposium at the Royal College of Physicians in London. The event brought together leading experts from both countries to explore cutting-edge developments in healthcare.

## Key Highlights

- **Telemedicine Advancements:** Experts showcased how remote diagnostics are bridging the gap between London specialists and regional hospitals in Azerbaijan.
- **Collaborative Research:** Three new joint research initiatives were announced, focusing on oncology and pediatrics.
- **Networking:** Over 50 mentorship connections were established between senior consultants and junior medical professionals.

"The synergy we witnessed today is exactly what AABP stands for," said Dr. Leyla Hasanova, Chair of the Medical Committee. "By sharing our expertise, we are elevating the standard of care in both of our home nations."

We look forward to publishing the full research papers presented at the symposium on our Research Hub in the coming weeks.
    `,
    authorId: "admin",
    authorName: "AABP Press Office",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173ff9e5eb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    tags: ["Medicine", "Events", "Symposium"],
    status: "Published",
    createdAt: { toMillis: () => Date.now() - 86400000 * 2 } // 2 days ago
  },
  {
    id: "mock-2",
    title: "New Mentorship Program Launched for IT Professionals",
    summary: "AABP is thrilled to announce a new 6-month mentorship initiative pairing senior software engineers and tech leaders in the UK with emerging talent from Azerbaijan.",
    content: `
# Empowering the Next Generation of Tech Leaders

In response to the rapidly growing tech sector in Azerbaijan, AABP has officially launched its **Tech Mentorship Initiative 2026**.

This program is designed to connect junior developers, data scientists, and IT students with experienced professionals working at top-tier tech companies in the UK, including Google, Amazon, and leading fintech startups.

## Program Structure

- **Duration:** 6 months
- **Format:** Bi-weekly 1-on-1 virtual meetings, monthly group workshops.
- **Focus Areas:** Software Architecture, AI/Machine Learning, Career Development, and Technical Interview Preparation.

"Our goal is to accelerate the career growth of our talented youth," noted the Head of the Technology Committee. "We have the experts in London, and we have the raw talent in Baku. This program is the bridge."

Applications are now open on the Member Portal.
    `,
    authorId: "admin",
    authorName: "AABP Career Center",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    tags: ["Technology", "Mentorship", "Career"],
    status: "Published",
    createdAt: { toMillis: () => Date.now() - 86400000 * 5 } // 5 days ago
  },
  {
    id: "mock-3",
    title: "Understanding the UK Tier 2 Global Talent Visa Process",
    summary: "A comprehensive guide for Azerbaijan academics and researchers looking to transition their careers to the United Kingdom under the Global Talent route.",
    content: `
# Navigating the Global Talent Visa

Relocating to the UK as an academic or researcher can be a complex process. The Global Talent Visa (formerly Tier 1 Exceptional Talent) is often the most suitable route for highly skilled professionals.

## Eligibility Criteria

To be eligible, applicants must receive an endorsement from one of the recognized UK bodies:
- The Royal Society (for science and medicine)
- The Royal Academy of Engineering
- The British Academy (for humanities)
- Tech Nation (for digital technology)

## How AABP Can Help

Our legal advisory team recently hosted a webinar breaking down the application process. Members can access the full recording in the Member Portal. Furthermore, AABP offers peer-review services for your endorsement applications.

*Disclaimer: AABP provides guidance based on community experience and does not replace official legal counsel.*
    `,
    authorId: "admin",
    authorName: "Legal & Immigration Committee",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    tags: ["Legal", "Career", "Visa"],
    status: "Published",
    createdAt: { toMillis: () => Date.now() - 86400000 * 12 }
  },
  {
    id: "mock-4",
    title: "Finance & Investment Forum 2026: Bridging Baku and London",
    summary: "Key takeaways from our recent Finance Forum, highlighting new investment opportunities in green energy and sustainable infrastructure.",
    content: `
# Finance & Investment Forum Highlights

Last week, AABP hosted its annual Finance & Investment Forum at the heart of London's financial district. The core theme of the evening was **Sustainable Investment and Green Energy Transition**.

## Key Takeaways

1. **Renewable Energy Potential:** Azerbaijan's commitment to increasing its renewable energy capacity by 2030 presents massive opportunities for UK-based green tech investors.
2. **Fintech Integration:** Discussions highlighted the need for modern payment gateways to facilitate smoother cross-border trade.
3. **Networking:** Over £5M in potential collaborative projects were discussed during the networking session.

We thank all our keynote speakers and sponsors for making this event a resounding success.
    `,
    authorId: "admin",
    authorName: "AABP Press Office",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    tags: ["Finance", "Events"],
    status: "Published",
    createdAt: { toMillis: () => Date.now() - 86400000 * 20 }
  },
  {
    id: "mock-5",
    title: "AABP Announces Scholarship Fund for Masters Students",
    summary: "Five outstanding Azerbaijan students will receive financial support to pursue their postgraduate studies at top UK universities this academic year.",
    content: `
# Supporting the Brightest Minds

Education is the cornerstone of progress. AABP is incredibly proud to announce the launch of the **AABP Excellence Scholarship Fund**.

This year, the fund will provide partial tuition support and living stipends to five exceptional Azerbaijan students pursuing Master's degrees in STEM (Science, Technology, Engineering, and Mathematics) at Russell Group universities.

## Application Details

Applications will open next month. Candidates will be evaluated based on:
- Academic excellence
- Leadership potential
- Commitment to contributing to the UK-Azerbaijan professional community upon graduation.

Detailed eligibility requirements will be published in our next newsletter.
    `,
    authorId: "admin",
    authorName: "Education Committee",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    tags: ["Education", "Scholarship"],
    status: "Published",
    createdAt: { toMillis: () => Date.now() - 86400000 * 25 }
  }
];
