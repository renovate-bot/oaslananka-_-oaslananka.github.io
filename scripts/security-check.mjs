import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function run(command, args) {
  const env = { ...process.env };
  delete env.NODE_PATH;

  const executable = process.platform === "win32" ? "cmd.exe" : command;
  const executableArgs =
    process.platform === "win32"
      ? [
          "/d",
          "/c",
          [command, ...args]
            .map((part) =>
              /[\s&()]/.test(part) ? `"${part.replaceAll('"', '\\"')}"` : part
            )
            .join(" "),
        ]
      : args;

  const result = spawnSync(executable, executableArgs, {
    env,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const tempDir = await mkdtemp(join(tmpdir(), "oaslananka-security-"));

try {
  run("pnpm", ["audit", "--audit-level=high", "--prod"]);
  run("node", ["scripts/generate-sbom.mjs", join(tempDir, "sbom.cdx.json")]);
} finally {
  await rm(tempDir, { force: true, recursive: true });
}
