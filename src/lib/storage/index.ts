import { writeFile, mkdir } from "fs/promises";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function saveGeneratedImages(
  userId: string,
  taskId: string,
  images: Array<{ data: Buffer; mimeType: string }>
): Promise<string[]> {
  const dir = path.join(PUBLIC_DIR, "output", userId, taskId);
  await mkdir(dir, { recursive: true });

  const urls: string[] = [];
  for (let i = 0; i < images.length; i++) {
    const ext = images[i].mimeType === "image/webp" ? "webp" : "png";
    const filename = `${i}.${ext}`;
    await writeFile(path.join(dir, filename), images[i].data);
    urls.push(`/output/${userId}/${taskId}/${filename}`);
  }
  return urls;
}

export async function saveUploadedImage(
  userId: string,
  taskId: string,
  data: Buffer,
  filename: string
): Promise<string> {
  const dir = path.join(PUBLIC_DIR, "input", userId, taskId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), data);
  return `/input/${userId}/${taskId}/${filename}`;
}
