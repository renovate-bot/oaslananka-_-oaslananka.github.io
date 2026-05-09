import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import YAML from "yaml";

const outputPath = process.argv[2] ?? "sbom.cdx.json";
const [packageJsonText, lockfileText] = await Promise.all([
  fs.readFile("package.json", "utf8"),
  fs.readFile("pnpm-lock.yaml", "utf8"),
]);
const packageJson = JSON.parse(packageJsonText);
const lockfile = YAML.parse(lockfileText);

function splitPackageKey(key) {
  const packageId = key.split("(")[0];
  const versionSeparator = packageId.startsWith("@")
    ? packageId.indexOf("@", 1)
    : packageId.lastIndexOf("@");

  if (versionSeparator <= 0) {
    return null;
  }

  return {
    name: packageId.slice(0, versionSeparator),
    version: packageId.slice(versionSeparator + 1),
  };
}

const seen = new Set();
const components = Object.keys(lockfile.packages ?? {})
  .map(splitPackageKey)
  .filter(Boolean)
  .filter(({ name, version }) => {
    const key = `${name}@${version}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  })
  .sort((a, b) =>
    `${a.name}@${a.version}`.localeCompare(`${b.name}@${b.version}`)
  )
  .map(({ name, version }) => ({
    type: "library",
    name,
    version,
  }));

const bom = {
  bomFormat: "CycloneDX",
  specVersion: "1.6",
  serialNumber: `urn:uuid:${randomUUID()}`,
  version: 1,
  metadata: {
    timestamp: new Date().toISOString(),
    tools: {
      components: [
        {
          type: "application",
          name: "oaslananka-sbom-generator",
          version: "1.0.0",
        },
      ],
    },
    component: {
      type: "application",
      name: packageJson.name,
      version: packageJson.version,
    },
  },
  components,
};

await fs.writeFile(outputPath, `${JSON.stringify(bom, null, 2)}\n`);
