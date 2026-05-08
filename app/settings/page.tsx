"use client";

import { useSyncExternalStore } from "react";
import { VscColorMode } from "react-icons/vsc";

import { THEMES } from "@/lib/themes";
import ThemeInfo from "@/components/ThemeInfo";

import styles from "@/styles/SettingsPage.module.css";

const themeChangeEvent = "portfolio-theme-change";
const defaultTheme = "github-dark";

const subscribeToTheme = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(themeChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeChangeEvent, callback);
  };
};

const getThemeSnapshot = () => localStorage.getItem("theme") || defaultTheme;
const getServerThemeSnapshot = () => defaultTheme;

const SettingsPage = () => {
  const activeTheme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const handleThemeSelect = (theme: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    window.dispatchEvent(new Event(themeChangeEvent));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.iconWrapper}>
            <VscColorMode className={styles.icon} size={24} />
          </div>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Settings</h1>
            <p className={styles.subtitle}>
              Customize your editor appearance. Choose from curated themes that
              match your style.
            </p>
          </div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Color Theme</h2>

          <div className={styles.themesGrid}>
            {THEMES.map((theme) => (
              <ThemeInfo
                key={theme.theme}
                icon={theme.icon}
                name={theme.name}
                publisher={theme.publisher}
                theme={theme.theme}
                isActive={activeTheme === theme.theme}
                onSelect={handleThemeSelect}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
