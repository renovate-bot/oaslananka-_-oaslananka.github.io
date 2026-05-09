import {
  VscBell,
  VscCheck,
  VscError,
  VscWarning,
  VscSourceControl,
  VscTerminal,
} from "react-icons/vsc";
import { SiNextdotjs } from "react-icons/si";

import { siteConfig } from "@/data/site";
import styles from "@/styles/Bottombar.module.css";

interface BottombarProps {
  onTerminalToggle: () => void;
  isTerminalOpen: boolean;
}

const Bottombar = ({ onTerminalToggle, isTerminalOpen }: BottombarProps) => {
  return (
    <footer className={styles.bottomBar}>
      <div className={styles.container}>
        <a
          href={siteConfig.links.githubRepo}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.section}
        >
          <VscSourceControl className={styles.icon} aria-hidden="true" />
          <p>main</p>
        </a>
        <div className={styles.section}>
          <VscError className={styles.icon} aria-hidden="true" />
          <p className={styles.errorText}>0</p>&nbsp;&nbsp;
          <VscWarning className={styles.icon} aria-hidden="true" />
          <p>0</p>
        </div>
      </div>
      <div className={styles.container}>
        <button
          className={`${styles.section} ${isTerminalOpen ? styles.active : ""}`}
          onClick={onTerminalToggle}
          title="Toggle Terminal (Ctrl+`)"
          type="button"
          aria-pressed={isTerminalOpen}
          aria-label="Toggle terminal"
        >
          <VscTerminal className={styles.icon} aria-hidden="true" />
        </button>
        <div className={styles.section}>
          <SiNextdotjs className={styles.icon} aria-hidden="true" />
          <p>Powered by Next.js</p>
        </div>
        <div className={styles.section}>
          <VscCheck className={styles.icon} aria-hidden="true" />
          <p>Prettier</p>
        </div>
        <div className={styles.section}>
          <VscBell aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
};

export default Bottombar;
