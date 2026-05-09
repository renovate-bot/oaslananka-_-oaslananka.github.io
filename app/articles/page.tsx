import { Metadata } from "next";
import { VscBook, VscLinkExternal, VscGlobe } from "react-icons/vsc";

import ArticleCard from "@/components/ArticleCard";

import { siteConfig } from "@/data/site";
import { getArticles } from "@/lib/articles";
import { createPageMetadata } from "@/lib/metadata";

import styles from "@/styles/ArticlesPage.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Articles",
  path: "/articles",
});

export const revalidate = 3600;

export default async function ArticlesPage() {
  const articles = await getArticles();
  const totalReactions = articles.reduce(
    (sum, article) => sum + article.public_reactions_count,
    0
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <div className={styles.iconWrapper}>
              <VscBook className={styles.icon} size={24} aria-hidden="true" />
            </div>

            <div className={styles.headerContent}>
              <div className={styles.headerTop}>
                <h1 className={styles.title}>Articles</h1>
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <VscGlobe size={14} aria-hidden="true" />
                    <span>{articles.length} posts</span>
                  </div>
                  <div className={styles.divider} />
                  <div className={styles.stat}>
                    <span>{totalReactions.toLocaleString()} reactions</span>
                  </div>
                </div>
              </div>

              <p className={styles.subtitle}>
                Technical writing on web development, software projects, and
                lessons learned while building real products.
              </p>
            </div>
          </div>

          <a
            href={siteConfig.links.devtoProfile}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <span>DEV.to</span>
            <VscLinkExternal size={14} aria-hidden="true" />
          </a>
        </header>

        <div className={styles.articlesList}>
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index + 1}
              />
            ))
          ) : (
            <p className={styles.subtitle}>
              No published articles are available right now. New technical notes
              will appear here as they are published.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
