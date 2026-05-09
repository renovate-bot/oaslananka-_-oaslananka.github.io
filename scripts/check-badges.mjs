import fs from "node:fs/promises";

const readme = await fs.readFile("README.md", "utf8");
const badgePattern = /\[!\[[^\]]*\]\((?<image>[^)]+)\)\]\((?<target>[^)]+)\)/g;
const badges = [...readme.matchAll(badgePattern)].map((match) => ({
  image: match.groups?.image,
  target: match.groups?.target,
}));

if (badges.length === 0) {
  throw new Error("README.md does not contain any linked badges.");
}

async function assertReachable(url, label) {
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
    throw new Error(`${label} is not reachable: ${url} (${response.status})`);
  }
}

for (const badge of badges) {
  await assertReachable(badge.image, "Badge image");
  await assertReachable(badge.target, "Badge target");
}

console.log(`Checked ${badges.length} README badge target(s).`);
