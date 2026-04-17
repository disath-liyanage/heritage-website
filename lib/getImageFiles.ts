import "server-only";
import fs from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function walkImages(dir: string, relative = ""): string[] {
  const absoluteDir = path.join(dir, relative);
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === ".DS_Store") {
      continue;
    }

    const relativePath = path.join(relative, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkImages(dir, relativePath));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) {
      continue;
    }

    if (entry.name.toLowerCase() === "logo.jpeg") {
      continue;
    }

    const publicPath = `/${path.join("images", relativePath).split(path.sep).join("/")}`;
    files.push(encodeURI(publicPath));
  }

  return files;
}

export default function getDiscoveredImages(): string[] {
  try {
    const imageRoot = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(imageRoot)) {
      return [];
    }

    const images = walkImages(imageRoot);
    return images;
  } catch {
    return [];
  }
}
