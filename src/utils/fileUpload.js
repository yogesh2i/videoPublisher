import { promises as fsp } from "fs";
import path from "path";


export async function saveTempFile(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempPath = path.join(process.cwd(), "tmp", `${Date.now()}-${file.name}`);
  await fsp.mkdir(path.dirname(tempPath), { recursive: true });
  await fsp.writeFile(tempPath, buffer);
  return tempPath;
} 