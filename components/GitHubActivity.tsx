"use client";

import dynamic from "next/dynamic";
import type { Props as GitHubCalendarProps } from "react-github-calendar";

const DynamicGitHubCalendar = dynamic<GitHubCalendarProps>(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  { ssr: false }
);

interface GitHubActivityProps {
  username: string;
}

export default function GitHubActivity({ username }: GitHubActivityProps) {
  return (
    <DynamicGitHubCalendar
      username={username}
      showColorLegend={false}
      showMonthLabels={false}
      colorScheme="dark"
      theme={{
        dark: ["#161B22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        light: ["#161B22", "#0e4429", "#006d32", "#26a641", "#39d353"],
      }}
      style={{
        width: "100%",
      }}
    />
  );
}
