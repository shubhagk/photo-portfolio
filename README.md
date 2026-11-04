# VetInWild Photography

React and Vite portfolio with a Cloudflare Worker API, R2 image storage, and D1 metadata/search.

## Data model

Each photo stores a category, year, country, species, subspecies, place, and optional description. The schema is in `migrations/0001_initial.sql`; its FTS5 index and triggers keep searchable text synchronized with photo metadata.

## Cloudflare setup

1. Install dependencies with `npm install`.
2. Create an R2 bucket named `photo-portfolio-images` and attach a public custom domain to it. The public domain is used only for reading images; writes go through the authenticated Worker API.
3. Create the D1 database and copy its ID into `wrangler.jsonc`:

   ```powershell
   npx wrangler@latest d1 create photo-portfolio
   ```

4. Replace `REPLACE_WITH_D1_DATABASE_ID` and `REPLACE_WITH_R2_CUSTOM_DOMAIN` in `wrangler.jsonc`.
5. Store admin credentials as Worker secrets. Use a unique, strong password and a random session secret:

   ```powershell
   npx wrangler@latest secret put ADMIN_USERNAME
   npx wrangler@latest secret put ADMIN_PASSWORD
   npx wrangler@latest secret put ADMIN_SESSION_SECRET
   ```

6. Apply the schema, build, and deploy:

   ```powershell
   npm run cloudflare:migrate:remote
   npm run cloudflare:deploy
   ```

For local development, run `npm run cloudflare:migrate:local`, then `npm run cloudflare:dev`. The API is same-origin under `/api`; no AWS URLs or credentials are used by the application.

## API routes

- `GET /api/photos` supports category, year, country, species, subspecies, place, and limit filters.
- `GET /api/categories` returns category counts.
- `GET /api/search?q=...` searches indexed metadata with D1 FTS5 and accepts the same filters.
- `POST /api/admin/login` returns a 12-hour signed admin session.
- `POST /api/admin/photos` uploads an image and saves its metadata.
- `PATCH /api/admin/photos/:id` updates metadata.
- `DELETE /api/admin/photos/:id` removes the database record and R2 object.

Supported uploads are JPEG, PNG, WebP, and AVIF up to 15 MB each.

## Moving existing AWS data

The app no longer calls AWS APIs, S3, or CloudFront. After creating the R2 bucket and applying the D1 schema, the one-time importer reads a public JSON manifest, copies each image into R2, and imports its metadata into D1. It uses R2's S3-compatible API; the credentials are Cloudflare R2 credentials, not AWS credentials.

Set these environment variables in your local shell (do not commit them):

- `LEGACY_MANIFEST_URL`: current public `images.json` URL.
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`: credentials from a scoped Cloudflare R2 token.

Then run `npm run cloudflare:import-legacy`. The importer expects a JSON array or an object with an `images` array. It maps `year`, `country`, `species`, `subspecies`, `place` (or legacy `city`), and `description` (or legacy `desc`). It can be rerun safely; object keys and database IDs are deterministic from each source image URL.

Keep AWS resources until the Cloudflare copy is confirmed, the production domain points to this deployment, and gallery, search, admin upload/edit/delete have been checked. Only then remove the AWS resources and credentials.
