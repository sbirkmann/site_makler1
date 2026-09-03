import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const extensions: Record<string, string> = {
  "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/avif": ".avif",
};

export function uploadRoot() {
  return process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");
}

export async function saveUploadedImage(file: File, folder: "blog" | "openimmo") {
  if (!allowedTypes.has(file.type) || file.size > 12 * 1024 * 1024) {
    throw new Error("Erlaubt sind JPG, PNG, WebP oder AVIF bis 12 MB.");
  }
  const targetDir = path.join(uploadRoot(), folder);
  await mkdir(targetDir, { recursive: true });
  const name = `${randomUUID()}${extensions[file.type]}`;
  await writeFile(path.join(targetDir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${name}`;
}
