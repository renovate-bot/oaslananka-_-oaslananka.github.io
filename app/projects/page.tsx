import { Metadata } from "next";
import { VscFolderOpened, VscGithub, VscLinkExternal } from "react-icons/vsc";

import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

import styles from "@/styles/ProjectsPage.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  path: "/projects",
});

const ProjectsPage = () => {
  const totalProjects = projects.length;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.iconWrapper}>
              <VscFolderOpened
                className={styles.icon}
                size={24}
                aria-hidden="true"
              />
            </div>
            <div className={styles.meta}>
              <span className={styles.count}>
                {totalProjects} Featured Projects
              </span>
            </div>
          </div>

          <div className={styles.headerContent}>
            <h1 className={styles.title}>Selected Work</h1>
            <p className={styles.subtitle}>
              Curated engineering artifacts behind the portfolio, repository
              operations, and open-source surface. Live GitHub data enriches the
              site, but these entries remain available offline.
            </p>
          </div>
        </header>

        <div className={styles.timeline}>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index + 1}
            />
          ))}
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerLine} />
          <a
            href={siteConfig.links.githubRepositories}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            <VscGithub size={18} aria-hidden="true" />
            <span>Explore more on GitHub</span>
            <VscLinkExternal size={14} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </div>
  );
};

export default ProjectsPage;
