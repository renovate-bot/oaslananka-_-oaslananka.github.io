import { Metadata } from "next";
import Image from "next/image";
import {
  VscGithub,
  VscLinkExternal,
  VscPerson,
  VscRepo,
  VscRepoForked,
  VscStarEmpty,
} from "react-icons/vsc";

import RepoCard from "@/components/RepoCard";
import GitHubActivity from "@/components/GitHubActivity";
import { siteConfig } from "@/data/site";
import { getGithubData } from "@/lib/github";
import { createPageMetadata } from "@/lib/metadata";

import styles from "@/styles/GithubPage.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Open Source",
  path: "/open-source",
});

export const revalidate = 600;

export default async function OpenSourcePage() {
  const { user, repos, sortedRepos, loadError } = await getGithubData();
  const profileLogin = user?.login ?? siteConfig.github.username;
  const profileUrl = `https://github.com/${profileLogin}`;
  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0
  );
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks, 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.profile}>
            {user ? (
              <Image
                src={user.avatar_url}
                className={styles.avatar}
                alt={user.login}
                width={80}
                height={80}
                priority
              />
            ) : null}
            <div className={styles.profileInfo}>
              <h1 className={styles.name}>Open Source</h1>
              <span className={styles.handle}>@{profileLogin}</span>
            </div>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <VscGithub size={18} aria-hidden="true" />
            <span>View Profile</span>
            <VscLinkExternal size={14} aria-hidden="true" />
          </a>
        </header>

        <p className={styles.summary}>
          Public repositories sorted from highest-starred to lowest, so the most
          visible open-source work appears first.
        </p>

        {loadError ? (
          <p className={styles.notice}>
            Live GitHub stats are temporarily unavailable, but the portfolio and
            source repository remain the canonical project entry point.
          </p>
        ) : null}

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscRepo size={20} aria-hidden="true" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{repos.length}</span>
              <span className={styles.statLabel}>Open Source Repos</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscPerson size={20} aria-hidden="true" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{user?.followers ?? 0}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscStarEmpty size={20} aria-hidden="true" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalStars}</span>
              <span className={styles.statLabel}>Total Stars</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscRepoForked size={20} aria-hidden="true" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalForks}</span>
              <span className={styles.statLabel}>Total Forks</span>
            </div>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contribution Activity</h2>
          <div
            className={styles.contributions}
            tabIndex={0}
            aria-label="GitHub contribution activity calendar"
            role="region"
          >
            <GitHubActivity username={siteConfig.github.username} />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Repositories by Stars</h2>
            <a
              href={`${profileUrl}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewAll}
            >
              View All
              <VscLinkExternal size={14} aria-hidden="true" />
            </a>
          </div>

          <div className={styles.reposGrid}>
            {sortedRepos.length > 0 ? (
              sortedRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
            ) : (
              <p className={styles.emptyState}>
                Repository highlights could not be loaded right now. Use the
                profile link above to view the latest projects on GitHub.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
