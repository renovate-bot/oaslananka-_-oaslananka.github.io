import Image from "next/image";
import { VscCheck, VscLinkExternal, VscSourceControl } from "react-icons/vsc";

import { Project } from "@/types";

import styles from "@/styles/ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.number}>
        <span>{String(index).padStart(2, "0")}</span>
      </div>

      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.header}>
            <div className={styles.logoWrapper}>
              <Image
                src={project.logo}
                alt={`${project.title} logo`}
                width={18}
                height={18}
                className={styles.logo}
              />
            </div>
            <h3 className={styles.title}>{project.title}</h3>
          </div>

          <p className={styles.description}>{project.description}</p>

          {project.stack && project.stack.length > 0 ? (
            <ul className={styles.stack} aria-label={`${project.title} stack`}>
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          {project.highlights && project.highlights.length > 0 ? (
            <ul className={styles.highlights}>
              {project.highlights.map((highlight) => (
                <li key={highlight}>
                  <VscCheck size={13} aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className={styles.action}>
          {project.status ? (
            <span className={styles.status}>
              <VscSourceControl size={12} aria-hidden="true" />
              {project.status}
            </span>
          ) : null}
          <span className={styles.link}>
            View Project
            <VscLinkExternal size={12} aria-hidden="true" />
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
