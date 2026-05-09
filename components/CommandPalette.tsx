"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  VscSymbolColor,
  VscTerminal,
  VscGoToFile,
  VscGear,
  VscColorMode,
  VscHome,
  VscAccount,
  VscCode,
  VscBook,
  VscMail,
  VscGithubAlt,
} from "react-icons/vsc";
import { MdNavigateNext } from "react-icons/md";

import { applyTheme } from "@/components/ThemeBootstrap";
import { THEMES } from "@/lib/themes";
import styles from "@/styles/CommandPalette.module.css";

interface Command {
  id: string;
  label: string;
  category: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
}

const CommandPalette = ({
  isOpen,
  onClose,
  onToggleTerminal,
  isTerminalOpen,
}: CommandPaletteProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const updateSearchQuery = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedIndex(0);
  }, []);

  const resetPalette = useCallback(() => {
    setSearchQuery("");
    setSelectedIndex(0);
    setShowThemePicker(false);
  }, []);

  const closePalette = useCallback(() => {
    resetPalette();
    onClose();
  }, [onClose, resetPalette]);

  const getCommands = useCallback((): Command[] => {
    const baseCommands: Command[] = [
      {
        id: "go-home",
        label: "Go to Home",
        category: "Navigation",
        shortcut: "G H",
        icon: <VscHome size={16} />,
        action: () => router.push("/"),
      },
      {
        id: "go-about",
        label: "Go to About",
        category: "Navigation",
        shortcut: "G A",
        icon: <VscAccount size={16} />,
        action: () => router.push("/about"),
      },
      {
        id: "go-projects",
        label: "Go to Projects",
        category: "Navigation",
        shortcut: "G P",
        icon: <VscCode size={16} />,
        action: () => router.push("/projects"),
      },
      {
        id: "go-articles",
        label: "Go to Articles",
        category: "Navigation",
        shortcut: "G R",
        icon: <VscBook size={16} />,
        action: () => router.push("/articles"),
      },
      {
        id: "go-contact",
        label: "Go to Contact",
        category: "Navigation",
        shortcut: "G C",
        icon: <VscMail size={16} />,
        action: () => router.push("/contact"),
      },
      {
        id: "go-open-source",
        label: "Go to Open Source",
        category: "Navigation",
        shortcut: "G G",
        icon: <VscGithubAlt size={16} />,
        action: () => router.push("/open-source"),
      },
      {
        id: "go-settings",
        label: "Go to Settings",
        category: "Navigation",
        shortcut: "G S",
        icon: <VscGear size={16} />,
        action: () => router.push("/settings"),
      },
      {
        id: "toggle-terminal",
        label: isTerminalOpen ? "Close Terminal" : "Open Terminal",
        category: "Terminal",
        shortcut: "Ctrl+`",
        icon: <VscTerminal size={16} />,
        action: onToggleTerminal,
      },
      {
        id: "change-theme",
        label: "Change Color Theme",
        category: "Preferences",
        shortcut: "K T",
        icon: <VscSymbolColor size={16} />,
        action: () => {
          setShowThemePicker(true);
          setSearchQuery("");
          setSelectedIndex(0);
        },
      },
    ];

    return baseCommands;
  }, [router, onToggleTerminal, isTerminalOpen]);

  const commands = getCommands();

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredThemes = THEMES.filter((theme) =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const activeItemId = showThemePicker
    ? filteredThemes[selectedIndex]
      ? `command-palette-theme-${filteredThemes[selectedIndex].theme}`
      : undefined
    : filteredCommands[selectedIndex]
      ? `command-palette-command-${filteredCommands[selectedIndex].id}`
      : undefined;

  const handleSelect = useCallback(
    (index: number) => {
      if (showThemePicker) {
        if (index < filteredThemes.length) {
          const theme = filteredThemes[index];
          applyTheme(theme.theme);
          closePalette();
        }
      } else {
        if (index < filteredCommands.length) {
          filteredCommands[index].action();
          if (filteredCommands[index].id !== "change-theme") {
            closePalette();
          }
        }
      }
    },
    [closePalette, filteredCommands, filteredThemes, showThemePicker]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        if (showThemePicker) {
          setShowThemePicker(false);
          updateSearchQuery("");
          setSelectedIndex(0);
        } else {
          closePalette();
        }
        return;
      }

      if (e.key === "Tab") {
        const focusable = Array.from(
          containerRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          ) ?? []
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!first || !last) return;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }

      const items = showThemePicker ? filteredThemes : filteredCommands;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (items.length === 0) return;
        setSelectedIndex((prev) => (prev + 1) % items.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (items.length === 0) return;
        setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(selectedIndex);
      }
    },
    [
      isOpen,
      closePalette,
      filteredCommands,
      filteredThemes,
      selectedIndex,
      handleSelect,
      showThemePicker,
      updateSearchQuery,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    inputRef.current?.focus();

    return () => {
      previousFocusRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex >= 0) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, searchQuery, showThemePicker]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closePalette}>
      <div
        ref={containerRef}
        className={styles.container}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        <div className={styles.inputWrapper}>
          <VscGoToFile size={20} className={styles.inputIcon} />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => updateSearchQuery(e.target.value)}
            placeholder={
              showThemePicker
                ? "Select color theme"
                : "Type a command or search..."
            }
            className={styles.input}
            spellCheck={false}
            autoComplete="off"
            aria-label="Search commands"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-palette-results"
            aria-activedescendant={activeItemId}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={() => {
                updateSearchQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div
          className={styles.results}
          id="command-palette-results"
          ref={listRef}
          role="listbox"
          aria-label={showThemePicker ? "Color themes" : "Commands"}
        >
          {showThemePicker ? (
            filteredThemes.length === 0 ? (
              <div className={styles.noResults}>No matching themes</div>
            ) : (
              <>
                <div className={styles.category} role="presentation">
                  Color Theme
                </div>
                {filteredThemes.map((theme, themeIndex) => (
                  <button
                    key={theme.theme}
                    id={`command-palette-theme-${theme.theme}`}
                    ref={(element) => {
                      itemRefs.current[themeIndex] = element;
                    }}
                    className={`${styles.item} ${
                      selectedIndex === themeIndex ? styles.selected : ""
                    }`}
                    onClick={() => handleSelect(themeIndex)}
                    onMouseEnter={() => setSelectedIndex(themeIndex)}
                    type="button"
                    role="option"
                    aria-selected={selectedIndex === themeIndex}
                  >
                    <div className={styles.itemIcon}>
                      <VscColorMode size={16} />
                    </div>
                    <div className={styles.itemContent}>
                      <span className={styles.itemLabel}>{theme.name}</span>
                      <span className={styles.itemDescription}>
                        {theme.publisher}
                      </span>
                    </div>
                  </button>
                ))}
              </>
            )
          ) : filteredCommands.length === 0 ? (
            <div className={styles.noResults}>No matching commands</div>
          ) : (
            (() => {
              let lastCategory = "";
              let itemIndex = 0;
              return filteredCommands.map((cmd) => {
                const showCategory = cmd.category !== lastCategory;
                lastCategory = cmd.category;
                const currentIndex = itemIndex++;
                return (
                  <div key={cmd.id}>
                    {showCategory && (
                      <div className={styles.category} role="presentation">
                        {cmd.category}
                      </div>
                    )}
                    <button
                      id={`command-palette-command-${cmd.id}`}
                      ref={(element) => {
                        itemRefs.current[currentIndex] = element;
                      }}
                      className={`${styles.item} ${
                        selectedIndex === currentIndex ? styles.selected : ""
                      }`}
                      onClick={() => handleSelect(currentIndex)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      type="button"
                      role="option"
                      aria-selected={selectedIndex === currentIndex}
                    >
                      <div className={styles.itemIcon}>{cmd.icon}</div>
                      <div className={styles.itemContent}>
                        <span className={styles.itemLabel}>{cmd.label}</span>
                      </div>
                      {cmd.shortcut && (
                        <div className={styles.shortcut}>
                          {cmd.id === "change-theme" ? (
                            <MdNavigateNext size={16} />
                          ) : (
                            cmd.shortcut.split(" ").map((key, i) => (
                              <span key={i} className={styles.key}>
                                {key}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                );
              });
            })()
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerItem}>
            <span className={styles.key}>↑↓</span> to navigate
          </div>
          <div className={styles.footerItem}>
            <span className={styles.key}>↵</span> to select
          </div>
          <div className={styles.footerItem}>
            <span className={styles.key}>esc</span> to close
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
