import { readFile } from "node:fs/promises";
import { parse } from "yaml";

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;

if (!token) {
  throw new Error("GH_TOKEN or GITHUB_TOKEN is required.");
}

if (!repository) {
  throw new Error("GITHUB_REPOSITORY is required.");
}

const [owner, repo] = repository.split("/");
const labels = parse(await readFile(".github/labels.yml", "utf8"));

if (!Array.isArray(labels)) {
  throw new Error(".github/labels.yml must contain a YAML array.");
}

async function request(path, init = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-github-api-version": "2022-11-28",
      ...init.headers,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = body?.message || response.statusText;
    const error = new Error(`${response.status} ${message}`);
    error.status = response.status;
    throw error;
  }

  return body;
}

for (const label of labels) {
  const payload = {
    name: label.name,
    color: label.color.replace(/^#/, ""),
    description: label.description || "",
  };
  const labelPath = `/repos/${owner}/${repo}/labels/${encodeURIComponent(label.name)}`;

  try {
    await request(labelPath, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    console.log(`updated ${label.name}`);
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }

    await request(`/repos/${owner}/${repo}/labels`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    console.log(`created ${label.name}`);
  }
}
