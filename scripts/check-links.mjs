import fs from "node:fs/promises";
import path from "node:path";

const files = ["README.md", "docs/index.html", "docs/404.html"];
const skipPatterns = [
  /^mailto:/,
  /^http:\/\/localhost:/,
  /^https:\/\/oaslananka\.dev/,
  /badge\.svg/,
];

function linksFromMarkdown(content) {
  return [...content.matchAll(/\[[^\]]+\]\((?<url>[^)]+)\)/g)]
    .map((match) => match.groups?.url)
    .filter(Boolean);
}

function linksFromHtml(content) {
  return [
    ...content.matchAll(
      /\b(?:href|content)=["'](?<url>https?:\/\/[^"']+)["']/g
    ),
  ]
    .map((match) => match.groups?.url)
    .filter(Boolean);
}

async function checkLocalLink(url, source) {
  const target = url.replace(/^\.?\//, "");
  const fullPath = path.resolve(target);

  try {
    await fs.access(fullPath);
  } catch {
    throw new Error(`${source} points to missing local file: ${url}`);
  }
}

async function checkRemoteLink(url, source) {
  const workflowMatch = url.match(
    /^https:\/\/github\.com\/oaslananka-lab\/oaslananka\.github\.io\/actions\/workflows\/(?<workflow>[^/?]+)/
  );

  if (workflowMatch?.groups?.workflow) {
    await fs.access(`.github/workflows/${workflowMatch.groups.workflow}`);
    return;
  }

  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      "User-Agent": "oaslananka.github.io-link-check",
    },
  });

  if (!response.ok) {
    throw new Error(`${source} link failed: ${url} (${response.status})`);
  }
}

let checked = 0;

for (const file of files) {
  const content = await fs.readFile(file, "utf8");
  const links = file.endsWith(".md")
    ? linksFromMarkdown(content)
    : linksFromHtml(content);

  for (const link of links) {
    if (skipPatterns.some((pattern) => pattern.test(link))) {
      continue;
    }

    if (/^https?:\/\//.test(link)) {
      await checkRemoteLink(link, file);
    } else {
      await checkLocalLink(link, file);
    }

    checked += 1;
  }
}

console.log(`Checked ${checked} documentation link(s).`);
