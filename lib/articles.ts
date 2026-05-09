import { siteConfig } from "@/data/site";
import { Article } from "@/types";

interface DevArticle {
  id: number;
  title: string;
  description?: string;
  cover_image?: string | null;
  url: string;
  public_reactions_count?: number;
  positive_reactions_count?: number;
  comments_count?: number;
}

const devArticlesUrl = new URL("https://dev.to/api/articles");
devArticlesUrl.searchParams.set("username", siteConfig.github.username);
devArticlesUrl.searchParams.set("per_page", "6");

function normalizeArticle(article: DevArticle): Article {
  return {
    id: String(article.id),
    title: article.title,
    description: article.description ?? "",
    cover_image: article.cover_image ?? null,
    url: article.url,
    page_views_count: 0,
    public_reactions_count:
      article.public_reactions_count ?? article.positive_reactions_count ?? 0,
    comments_count: article.comments_count ?? 0,
  };
}

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(devArticlesUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": siteConfig.github.userAgent,
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return [];
    }

    const articles = (await response.json()) as DevArticle[];

    return articles.map(normalizeArticle);
  } catch {
    return [];
  }
}
