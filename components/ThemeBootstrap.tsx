"use client";

import { useEffect } from "react";

const defaultTheme = "github-dark";

export const themeChangeEvent = "portfolio-theme-change";

export function applyTheme(theme: string) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event(themeChangeEvent));
}

export default function ThemeBootstrap() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || defaultTheme;
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return null;
}
