import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["exec", "next", "build"], {
  env: {
    ...process.env,
    ANALYZE: "true",
    NEXT_TELEMETRY_DISABLED: "1",
  },
  shell: process.platform === "win32",
  stdio: "inherit",
});

process.exit(result.status ?? 1);
