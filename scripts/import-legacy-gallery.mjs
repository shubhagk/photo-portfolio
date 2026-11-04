import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fileURLToPath } from "node:url";

const required = [
  "LEGACY_MANIFEST_URL",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  throw new Error(`Set the following environment variables first: ${missing.join(", ")}`);
}

const bucket = process.env.R2_BUCKET || "photo-portfolio-images";
const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const manifestUrl = new URL(process.env.LEGACY_MANIFEST_URL);
const manifestResponse = await fetch(manifestUrl);
if (!manifestResponse.ok) {
  throw new Error(`Could not read legacy manifest (${manifestResponse.status}).`);
}
const manifest = await manifestResponse.json();
const photos = Array.isArray(manifest) ? manifest : manifest.images;
if (!Array.isArray(photos)) throw new Error("Legacy manifest must be an array or contain an images array.");

const sql = ["PRAGMA foreign_keys = ON;"];
let imported = 0;

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchImageWithRetry(url, index) {
  let response;
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      response = await fetch(url);
      if (response.ok) return response;
      if (![403, 429].includes(response.status) && response.status < 500) break;
      await response.body?.cancel();
    } catch (error) {
      lastError = error;
    }
    if (attempt < 3) await delay(attempt * 1500);
  }
  const safeUrl = `${url.origin}${url.pathname}`;
  if (lastError && !response) {
    throw new Error(`Could not download photo ${index + 1} from ${safeUrl}: ${lastError.message}`);
  }
  throw new Error(`Could not download photo ${index + 1} (${response.status}) from ${safeUrl}.`);
}

function escapeSql(value) {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return `'${String(value).replace(/'/g, "''").slice(0, 2000)}'`;
}

function extFromType(type, url) {
  const fromMime = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" })[type];
  if (fromMime) return fromMime;
  const ext = new URL(url).pathname.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "avif"].includes(ext) ? (ext === "jpeg" ? "jpg" : ext) : "jpg";
}

async function readLocalFallback(url) {
  const parts = decodeURIComponent(dirname(url.pathname))
    .split(/[\\/]+/)
    .filter((part) => part && part !== "." && part !== "..");
  const originalName = basename(decodeURIComponent(url.pathname));
  const fallbackName = originalName.replace(/^\d+[-_]/, "");
  if (!fallbackName || fallbackName === originalName) return null;

  const candidate = join(projectRoot, "public", ...parts, fallbackName);
  try {
    const body = await readFile(candidate);
    const extension = fallbackName.split(".").pop()?.toLowerCase();
    const contentType = ({ jpeg: "image/jpeg", jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" })[extension];
    return contentType ? { body, contentType } : null;
  } catch {
    return null;
  }
}

for (const [index, item] of photos.entries()) {
  const originalUrl = item.imageUrl || item.url || item.src;
  if (!originalUrl) throw new Error(`Photo ${index + 1} has no image URL.`);
  const imageUrl = new URL(originalUrl, manifestUrl);
  let bytes;
  let contentType;
  try {
    const response = await fetchImageWithRetry(imageUrl, index);
    bytes = Buffer.from(await response.arrayBuffer());
    contentType = (response.headers.get("content-type") || "image/jpeg").split(";")[0];
    if (!contentType.startsWith("image/")) throw new Error(`Photo ${index + 1} did not return image content.`);
  } catch (error) {
    const fallback = await readLocalFallback(imageUrl);
    if (!fallback) throw error;
    bytes = fallback.body;
    contentType = fallback.contentType;
    console.log(`Using the local repository copy for photo ${index + 1}`);
  }
  if (!contentType.startsWith("image/")) throw new Error(`Photo ${index + 1} did not return image content.`);
  const id = createHash("sha256").update(imageUrl.href).digest("hex").slice(0, 32);
  const key = `photos/${id}.${extFromType(contentType, imageUrl.href)}`;

  await s3.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: bytes,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));

  const category = item.category || "uncategorized";
  const year = Number(item.year);
  const values = [
    id,
    key,
    category,
    Number.isInteger(year) && year > 0 ? year : null,
    item.country || "",
    item.species || "",
    item.subspecies || item.subSpecies || "",
    item.place || item.city || "",
    item.description || item.desc || "",
  ].map(escapeSql);

  sql.push(
    `INSERT INTO photos (id, object_key, category, year, country, species, subspecies, place, description) VALUES (${values.join(", ")}) ` +
      `ON CONFLICT(id) DO UPDATE SET object_key=excluded.object_key, category=excluded.category, year=excluded.year, country=excluded.country, species=excluded.species, subspecies=excluded.subspecies, place=excluded.place, description=excluded.description;`,
  );
  imported += 1;
  console.log(`Copied ${imported}/${photos.length}`);
}

const sqlPath = join(tmpdir(), `photo-portfolio-import-${Date.now()}.sql`);
await writeFile(sqlPath, sql.join("\n"), "utf8");
let importSucceeded = false;
try {
  const quotedSqlPath = `"${sqlPath.replace(/"/g, '""')}"`;
  execSync(`npx --yes wrangler@latest d1 execute photo-portfolio --remote --file=${quotedSqlPath}`, {
    stdio: "inherit",
  });
  importSucceeded = true;
  console.log(`Imported ${imported} photos. Set MEDIA_BASE_URL in wrangler.jsonc to the R2 public custom domain.`);
} catch (error) {
  console.error(`Photo objects are in R2, but the D1 import failed. SQL file retained at ${sqlPath}`);
  throw error;
} finally {
  if (importSucceeded) await unlink(sqlPath).catch(() => {});
}
