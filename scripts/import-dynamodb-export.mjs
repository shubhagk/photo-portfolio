import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { createGunzip } from "node:zlib";
import { createReadStream } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const exportDirectory = process.argv[2];
if (!exportDirectory) {
  throw new Error("Usage: node scripts/import-dynamodb-export.mjs <directory-with-json.gz-files> [--apply]");
}

const apply = process.argv.includes("--apply");
const files = (await readdir(exportDirectory))
  .filter((file) => file.toLowerCase().endsWith(".json.gz"))
  .sort();
if (!files.length) throw new Error(`No .json.gz export files found in ${exportDirectory}`);

function ddbValue(attribute) {
  if (!attribute || typeof attribute !== "object") return "";
  if (attribute.S !== undefined) return attribute.S;
  if (attribute.N !== undefined) return attribute.N;
  if (attribute.SS !== undefined) return attribute.SS.join(", ");
  if (attribute.NS !== undefined) return attribute.NS.join(", ");
  if (attribute.BOOL !== undefined) return String(attribute.BOOL);
  if (attribute.L !== undefined) return attribute.L.map(ddbValue).filter(Boolean).join(", ");
  return "";
}

function sqlString(value) {
  return `'${String(value ?? "").replace(/'/g, "''").slice(0, 2000)}'`;
}

const statements = [];
const seen = new Set();
for (const file of files) {
  const input = createInterface({ input: createReadStream(join(exportDirectory, file)).pipe(createGunzip()), crlfDelay: Infinity });
  for await (const line of input) {
    if (!line.trim()) continue;
    const item = JSON.parse(line).Item;
    const imageUrl = ddbValue(item.imageUrl).trim();
    if (!imageUrl) throw new Error(`Record in ${file} has no imageUrl.`);

    // This matches the stable ID scheme used by the existing R2/D1 gallery importer.
    const id = createHash("sha256").update(new URL(imageUrl).href).digest("hex").slice(0, 32);
    if (seen.has(id)) throw new Error(`Duplicate photo URL in export: ${imageUrl}`);
    seen.add(id);

    const rawYear = Number(ddbValue(item.year));
    const year = Number.isInteger(rawYear) && rawYear > 0 ? String(rawYear) : "NULL";
    const country = ddbValue(item.country);
    const species = ddbValue(item.species);
    const category = ddbValue(item.category);
    const description = ddbValue(item.desc);
    statements.push(
      `UPDATE photos SET category=${sqlString(category)}, year=${year}, country=${sqlString(country)}, ` +
      `species=${sqlString(species)}, description=${sqlString(description)}, updated_at=CURRENT_TIMESTAMP WHERE id=${sqlString(id)};`,
    );
  }
}

if (!statements.length) throw new Error("The export files contained no records.");
const sql = `${statements.join("\n")}\n`;
const sqlPath = join(tmpdir(), `photo-portfolio-dynamodb-${Date.now()}.sql`);
await writeFile(sqlPath, sql, "utf8");
console.log(`Read ${seen.size} records from ${files.length} files.`);
console.log(`SQL prepared at ${sqlPath}`);
console.log("The update matches existing photos by image URL and leaves photos without a DynamoDB record unchanged.");

if (apply) {
  const projectRoot = fileURLToPath(new URL("..", import.meta.url));
  const quotedSqlPath = `"${sqlPath.replace(/"/g, '""')}"`;
  execSync(`npx --yes wrangler@latest d1 execute photo-portfolio --remote --file=${quotedSqlPath}`, {
    cwd: projectRoot,
    stdio: "inherit",
  });
}
