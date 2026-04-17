import fs from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function getAllImageFiles(dir: string, relative = ""): string[] {
  const entries = fs.readdirSync(path.join(dir, relative), { withFileTypes: true });
  const collected: string[] = [];

  for (const entry of entries) {
    if (entry.name === ".DS_Store") {
      continue;
    }

    const relativePath = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      collected.push(...getAllImageFiles(dir, relativePath));
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (IMAGE_EXTENSIONS.has(ext) && entry.name.toLowerCase() !== "logo.jpeg") {
      const srcPath = `/${path.join("images", relativePath).split(path.sep).join("/")}`;
      collected.push(encodeURI(srcPath));
    }
  }

  return collected;
}

export default function getDiscoveredImages(): string[] {
  const imageRoot = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(imageRoot)) {
    return ["/images/outdoor/river.jpeg"];
  }

  const discoveredImages = getAllImageFiles(imageRoot);
  return discoveredImages.length ? discoveredImages : ["/images/outdoor/river.jpeg"];
}
