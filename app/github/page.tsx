import { Metadata } from 'next';
import Image from 'next/image';
import GitHubCalendar from 'react-github-calendar';
import { VscRepo, VscPerson, VscStarEmpty, VscRepoForked, VscLinkExternal, VscGithub } from 'react-icons/vsc';

import RepoCard from '@/components/RepoCard';
import { siteConfig } from '@/data/site';
import { Repo, User } from '@/types';

import styles from '@/styles/GithubPage.module.css';

export const metadata: Metadata = {
  title: 'GitHub',
};

export const revalidate = 600;
const REPOS_PER_PAGE = 100;

async function fetchGithubJson<T>(url: string, headers?: HeadersInit) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub data: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function getAllRepos(username: string, headers?: HeadersInit) {
  const allRepos: Repo[] = [];

  for (let page = 1; ; page += 1) {
    const pageRepos = await fetchGithubJson<Repo[]>(
      `https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=${REPOS_PER_PAGE}&page=${page}`,
      headers
    );

    allRepos.push(...pageRepos);

    if (pageRepos.length < REPOS_PER_PAGE) {
      break;
    }
  }

  return allRepos;
}

async function getGithubData() {
  try {
    const headers = process.env.GITHUB_API_KEY
      ? {
          Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
        }
      : undefined;

    const username = siteConfig.github.username;

    const [user, allRepos] = await Promise.all([
      fetchGithubJson<User>(`https://api.github.com/users/${username}`, headers),
      getAllRepos(username, headers),
    ]);

    const portfolioRepos = allRepos.filter((repo) => !repo.fork);
    const repos = portfolioRepos.length > 0 ? portfolioRepos : allRepos;
    const popularRepos = [...repos]
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }

        if (b.forks !== a.forks) {
          return b.forks - a.forks;
        }

        return b.watchers - a.watchers;
      })
      .slice(0, 6);

    return { user, repos, popularRepos, loadError: false };
  } catch (error) {
    console.error('Failed to load GitHub profile data.', error);

    return {
      user: null,
      repos: [],
      popularRepos: [],
      loadError: true,
    };
  }
}

export default async function GithubPage() {
  const { user, repos, popularRepos, loadError } = await getGithubData();
  const profileLogin = user?.login ?? siteConfig.github.username;
  const profileUrl = `https://github.com/${profileLogin}`;
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks, 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
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
              <h1 className={styles.name}>{profileLogin}</h1>
              <span className={styles.handle}>@{profileLogin}</span>
            </div>
          </div>

          <a 
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.profileLink}
          >
            <VscGithub size={18} />
            <span>View Profile</span>
            <VscLinkExternal size={14} />
          </a>
        </header>

        {loadError ? (
          <p className={styles.notice}>
            Live GitHub stats are temporarily unavailable, but the portfolio and
            source repository remain the canonical project entry point.
          </p>
        ) : null}

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscRepo size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{repos.length}</span>
              <span className={styles.statLabel}>Repositories</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscPerson size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{user?.followers ?? 0}</span>
              <span className={styles.statLabel}>Followers</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscStarEmpty size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalStars}</span>
              <span className={styles.statLabel}>Total Repo Stars</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <VscRepoForked size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalForks}</span>
              <span className={styles.statLabel}>Total Repo Forks</span>
            </div>
          </div>
        </div>

        {/* Contribution Graph */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contribution Activity</h2>
          <div className={styles.contributions}>
            <GitHubCalendar
              username={siteConfig.github.username}
              hideColorLegend
              hideMonthLabels
              colorScheme="dark"
              theme={{
                dark: ['#161B22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                light: ['#161B22', '#0e4429', '#006d32', '#26a641', '#39d353'],
              }}
              style={{
                width: '100%',
              }}
            />
          </div>
        </section>

        {/* Repositories */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Repositories</h2>
            <a 
              href={`${profileUrl}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viewAll}
            >
              View All
              <VscLinkExternal size={14} />
            </a>
          </div>
          
          <div className={styles.reposGrid}>
            {popularRepos.length > 0 ? (
              popularRepos.map((repo) => <RepoCard key={repo.id} repo={repo} />)
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
