"use client";

import { useEffect, useState } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { Section, SectionHeader } from "@/components/shared/Section";
import { Hero } from "@/components/shared/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Download, FileText, ArrowLeft, BookOpen } from "lucide-react";
import { getResources, Resource } from "@/lib/firebase/db-resources";
import { useAuth } from "@/lib/firebase/useAuth";
import { useTranslations } from "next-intl";

const CATEGORIES = ["All", "Medical Science", "Natural Science", "Life Science", "Social Science", "Engineering", "Career", "Events"];

export function ResourcesClient() {
  const t = useTranslations();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    (async () => {
      const data = await getResources(activeCategory === "All" ? undefined : activeCategory);
      setResources(data);
      setIsLoading(false);
    })();
  }, [activeCategory]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <Hero
        title="Resource Library"
        subtitle="Access educational materials, documents, and resources shared by the community."
        backgroundImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      />

      <Section className="bg-card">
        <SectionHeader
          title="Library"
          subtitle="Browse resources by category"
          centered
        />

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No resources found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {resources.map((resource) => (
              <Card key={resource.id} className="shadow-sm border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                  </div>
                  <Badge variant="secondary" className="w-fit mt-2">{resource.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{resource.description}</p>
                  <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
