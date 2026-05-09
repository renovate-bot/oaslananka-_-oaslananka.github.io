import fs from "node:fs/promises";

const forbiddenPatterns = [
  ["RELEASE", "_", "VERSION"],
  ["INPUT", "_", "VERSION"],
  ["TAG", "_", "NAME"],
  ["github", ".", "event", ".", "inputs", ".", "version"],
  ["github", ".", "event", ".", "inputs", ".", "release", "_", "version"],
].map(
  (parts) =>
    new RegExp(
      parts.map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("")
    )
);

forbiddenPatterns.push(/workflow_dispatch:\s*\n(?:[\s\S]*?\n)?\s+inputs:/);

const [packageJson, configJson, manifestJson, releaseWorkflow] =
  await Promise.all([
    fs.readFile("package.json", "utf8").then(JSON.parse),
    fs.readFile("release-please-config.json", "utf8").then(JSON.parse),
    fs.readFile(".release-please-manifest.json", "utf8").then(JSON.parse),
    fs.readFile(".github/workflows/release.yml", "utf8"),
  ]);

if (configJson["release-type"] !== "node") {
  throw new Error("release-please must use node release type.");
}

if (!configJson.packages?.["."]) {
  throw new Error("release-please manifest mode package entry is missing.");
}

if (configJson.packages["."]["package-name"] !== packageJson.name) {
  throw new Error("release-please package name does not match package.json.");
}

if (manifestJson["."] !== packageJson.version) {
  throw new Error("release-please manifest version must match package.json.");
}

for (const pattern of forbiddenPatterns) {
  if (pattern.test(releaseWorkflow)) {
    throw new Error(`Forbidden manual release pattern found: ${pattern}`);
  }
}

console.log("Release automation is configured for manifest-mode dry run.");
