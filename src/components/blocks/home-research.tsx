import { SectionHeader } from "@/components/shared/Section";
import { ResearchCard } from "@/components/shared/cards/ResearchCard";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { adminDb } from "@/lib/firebase/admin";
import { AABPResearch } from "@/lib/firebase/db-research";

export async function HomeResearch() {
  let researchList: AABPResearch[] = [];
  try {
    if (!adminDb) {
      console.warn("Firebase Admin DB not initialized. Skipping research fetch.");
    } else {
      const snapshot = await adminDb.collection("research")
        .orderBy("date", "desc")
        .limit(3)
        .get();
        
      researchList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          abstract: data.abstract || "",
          authors: data.authors || [],
          field: data.field || "",
          date: data.date || "",
          link: data.link || ""
        } as AABPResearch;
      });
    }
  } catch (error) {
    console.error("Failed to load research for home:", error instanceof Error ? error.message : error);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <SectionHeader 
          title="Recent Publications"
          subtitle="Research Hub"
          className="mb-0"
        />
        <Button render={<Link href="/research" />} variant="link" className="text-accent font-semibold hidden md:flex">
          View All Research &rarr;
        </Button>
      </div>

      {researchList.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No research publications available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchList.map((item, i) => (
            <ResearchCard 
              key={item.id || i} 
              title={item.title}
              abstract={item.abstract}
              authors={item.authors}
              field={item.field}
              date={item.date}
              link={item.link}
            />
          ))}
        </div>
      )}

      <div className="mt-8 text-center md:hidden">
        <Button render={<Link href="/research" />} variant="outline" className="rounded-full">
          View All Research
        </Button>
      </div>
    </>
  );
}
