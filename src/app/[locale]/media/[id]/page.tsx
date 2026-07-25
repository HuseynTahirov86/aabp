import type { Metadata } from "next";
import { getArticleById } from "@/lib/firebase/db-articles";
import { MOCK_ARTICLES } from "@/lib/mock/articles";
import { ArticleClient } from "./_client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article =
    (await getArticleById(id)) ?? MOCK_ARTICLES.find((a) => a.id === id) ?? null;
  return {
    title: article?.title ?? "Article",
    description:
      article?.summary ??
      "AABP news and articles — updates from the Association of Azerbaijan British Professionals.",
  };
}

export default function ArticlePage() {
  return <ArticleClient />;
}
