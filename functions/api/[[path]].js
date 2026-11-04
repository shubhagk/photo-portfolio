const PHOTO_FIELDS = [
  "category",
  "year",
  "country",
  "species",
  "subspecies",
  "place",
  "description",
];
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function normalizePhoto(row) {
  const objectPath = row.object_key.split("/").map(encodeURIComponent).join("/");
  const url = `/media/${objectPath}`;
  return {
    imageId: row.id,
    id: row.id,
    objectKey: row.object_key,
    imageUrl: url,
    url,
    category: row.category,
    year: row.year,
    country: row.country,
    species: row.species,
    subspecies: row.subspecies,
    place: row.place,
    description: row.description,
    desc: row.description,
    createdAt: row.created_at,
  };
}

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(payload, secret) {
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encoded));
  return `${encoded}.${toBase64Url(new Uint8Array(signature))}`;
}

async function verifyToken(token, secret) {
  const [payloadPart, signaturePart] = (token || "").split(".");
  if (!payloadPart || !signaturePart) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signaturePart),
    new TextEncoder().encode(payloadPart),
  );
  if (!valid) return false;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadPart)));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function requireAdmin(request, env) {
  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  return Boolean(token && env.ADMIN_SESSION_SECRET && await verifyToken(token, env.ADMIN_SESSION_SECRET));
}

function cleanText(value, maxLength = 500) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function buildPhotoQuery(searchParams) {
  const conditions = [];
  const values = [];
  for (const field of ["category", "country", "species", "subspecies", "place"]) {
    const value = cleanText(searchParams.get(field), 120);
    if (value) {
      conditions.push(`LOWER(${field}) = LOWER(?)`);
      values.push(value);
    }
  }
  const year = Number(searchParams.get("year"));
  if (Number.isInteger(year) && year > 0) {
    conditions.push("year = ?");
    values.push(year);
  }
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 500, 1), 500);
  return { conditions, values, limit };
}

async function listPhotos(env, params) {
  const { conditions, values, limit } = buildPhotoQuery(params);
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const rows = await env.DB.prepare(
    `SELECT * FROM photos ${where} ORDER BY year DESC, created_at DESC LIMIT ?`,
  ).bind(...values, limit).all();
  return (rows.results || []).map(normalizePhoto);
}

async function searchPhotos(env, params) {
  const { conditions, values, limit } = buildPhotoQuery(params);
  const query = cleanText(params.get("q"), 200);
  if (!query) return listPhotos(env, params);

  const tokens = query.match(/[\p{L}\p{N}_-]+/gu) || [];
  if (!tokens.length) return [];
  const match = tokens.slice(0, 12).map((token) => `"${token.replace(/"/g, '""')}"*`).join(" AND ");
  const where = conditions.length ? `AND ${conditions.join(" AND ")}` : "";
  const rows = await env.DB.prepare(
    `SELECT p.* FROM photo_search s JOIN photos p ON p.id = s.photo_id
     WHERE photo_search MATCH ? ${where}
     ORDER BY bm25(photo_search), p.year DESC, p.created_at DESC LIMIT ?`,
  ).bind(match, ...values, limit).all();
  return (rows.results || []).map(normalizePhoto);
}

async function serveImage(request, env, url) {
  const method = request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return new Response("Method not allowed.", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  let objectKey;
  try {
    objectKey = decodeURIComponent(url.pathname.slice("/media/".length));
  } catch {
    return new Response("Not found.", { status: 404 });
  }
  if (!/^photos\/[A-Za-z0-9_-]+\.(?:jpg|png|webp|avif)$/i.test(objectKey)) {
    return new Response("Not found.", { status: 404 });
  }

  const object = method === "HEAD"
    ? await env.PHOTOS.head(objectKey)
    : await env.PHOTOS.get(objectKey);
  if (!object) return new Response("Not found.", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", object.httpMetadata?.contentType || "image/jpeg");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  if (object.httpEtag) headers.set("ETag", object.httpEtag);
  headers.set("Content-Length", String(object.size));

  const ifNoneMatch = request.headers.get("If-None-Match");
  if (ifNoneMatch && (ifNoneMatch === "*" || ifNoneMatch.split(",").map((tag) => tag.trim()).includes(object.httpEtag))) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(method === "HEAD" ? null : object.body, { headers });
}

async function categories(env) {
  const rows = await env.DB.prepare(
    `SELECT category AS value, COUNT(*) AS count FROM photos
     WHERE category <> '' AND LOWER(category) <> 'shuffle'
     GROUP BY LOWER(category) ORDER BY LOWER(category)`,
  ).all();
  return rows.results || [];
}

function safeExtension(contentType) {
  return ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" })[contentType];
}

async function uploadPhoto(request, env) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) return json({ error: "Choose an image file." }, 400);
  if (!ALLOWED_TYPES.has(file.type)) return json({ error: "Use a JPEG, PNG, WebP, or AVIF image." }, 415);
  if (file.size > MAX_UPLOAD_BYTES) return json({ error: "Images must be 15 MB or smaller." }, 413);

  const id = crypto.randomUUID();
  const objectKey = `photos/${id}.${safeExtension(file.type)}`;
  const category = cleanText(form.get("category"), 100);
  const yearValue = cleanText(form.get("year"), 4);
  const year = yearValue ? Number(yearValue) : null;
  if (!category) return json({ error: "Category is required." }, 400);
  if (yearValue && (!Number.isInteger(year) || year < 1800 || year > 2200)) {
    return json({ error: "Enter a valid year." }, 400);
  }

  await env.PHOTOS.put(objectKey, file.stream(), {
    httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" },
    customMetadata: { originalName: cleanText(file.name, 180) },
  });

  try {
    await env.DB.prepare(
      `INSERT INTO photos (id, object_key, category, year, country, species, subspecies, place, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      id,
      objectKey,
      category,
      year,
      cleanText(form.get("country"), 120),
      cleanText(form.get("species"), 160),
      cleanText(form.get("subspecies"), 160),
      cleanText(form.get("place"), 200),
      cleanText(form.get("description"), 2000),
    ).run();
  } catch (error) {
    await env.PHOTOS.delete(objectKey);
    throw error;
  }

  const row = await env.DB.prepare("SELECT * FROM photos WHERE id = ?").bind(id).first();
  return json(normalizePhoto(row), 201);
}

async function updatePhoto(request, env, id) {
  const payload = await request.json();
  const updates = payload.updates || payload;
  const current = await env.DB.prepare("SELECT * FROM photos WHERE id = ?").bind(id).first();
  if (!current) return json({ error: "Photo not found." }, 404);

  const assignments = [];
  const values = [];
  for (const field of PHOTO_FIELDS) {
    if (!(field in updates)) continue;
    if (field === "year") {
      const year = updates.year === "" || updates.year == null ? null : Number(updates.year);
      if (year !== null && (!Number.isInteger(year) || year < 1800 || year > 2200)) {
        return json({ error: "Enter a valid year." }, 400);
      }
      assignments.push("year = ?");
      values.push(year);
    } else {
      const value = cleanText(updates[field], field === "description" ? 2000 : 200);
      assignments.push(`${field} = ?`);
      values.push(value);
    }
  }
  if (!assignments.length) return json(normalizePhoto(current));
  assignments.push("updated_at = CURRENT_TIMESTAMP");
  await env.DB.prepare(`UPDATE photos SET ${assignments.join(", ")} WHERE id = ?`)
    .bind(...values, id).run();
  const updated = await env.DB.prepare("SELECT * FROM photos WHERE id = ?").bind(id).first();
  return json(normalizePhoto(updated));
}

async function deletePhoto(env, id) {
  const photo = await env.DB.prepare("SELECT object_key FROM photos WHERE id = ?").bind(id).first();
  if (!photo) return json({ error: "Photo not found." }, 404);
  await env.DB.prepare("DELETE FROM photos WHERE id = ?").bind(id).run();
  await env.PHOTOS.delete(photo.object_key);
  return new Response(null, { status: 204 });
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, "");
  const method = request.method.toUpperCase();

  try {
    if (url.pathname.startsWith("/media/")) return await serveImage(request, env, url);
    if (method === "GET" && path === "photos") return json(await listPhotos(env, url.searchParams));
    if (method === "GET" && path === "categories") return json(await categories(env));
    if (method === "GET" && path === "search") return json(await searchPhotos(env, url.searchParams));

    if (method === "POST" && path === "admin/login") {
      if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
        return json({ error: "Admin login is not configured." }, 503);
      }
      const { username, password } = await request.json();
      if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
        return json({ error: "Invalid username or password." }, 401);
      }
      const token = await sign({ sub: username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 }, env.ADMIN_SESSION_SECRET);
      return json({ token });
    }

    const adminPhotoMatch = path.match(/^admin\/photos\/([\w-]+)$/);
    if ((path === "admin/photos" && method === "POST") || adminPhotoMatch) {
      if (!(await requireAdmin(request, env))) return json({ error: "Admin session expired. Please sign in again." }, 401);
      if (path === "admin/photos" && method === "POST") return await uploadPhoto(request, env);
      if (adminPhotoMatch && method === "PATCH") return await updatePhoto(request, env, adminPhotoMatch[1]);
      if (adminPhotoMatch && method === "DELETE") return await deletePhoto(env, adminPhotoMatch[1]);
    }

    return json({ error: "Not found." }, 404);
  } catch (error) {
    console.error("API request failed", error);
    return json({ error: "The request could not be completed." }, 500);
  }
}

export default {
  fetch(request, env) {
    return onRequest({ request, env });
  },
};
