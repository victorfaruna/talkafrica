# TalkAfricaNG Supabase egress audit

Audited locally on 1 November 2026. This report captures validation before the
separate deployment follow-up.
No content was deleted, no schema or RLS policy was changed, and no service or
billing plan was purchased or changed. Database inspection used read-only queries;
publishing tests used mocks, not real content writes.

## What is established

The reported approximately 11.7 GB between 17 October and 1 November is context,
not an endpoint measurement. Supabase account usage charts and historical request
logs were unavailable. The findings below demonstrate avoidable transfer, but
cannot attribute a percentage of that historical total to any endpoint.

The app uses SvelteKit 2 / Svelte 5 on Vercel. Application reads mostly use
Drizzle and postgres-js through Supabase's **shared connection pooler**, confirmed
without printing the connection string. This traffic should be investigated under
Shared Pooler Egress, separately from Storage and PostgREST Database Egress.
[Supabase's service definitions](https://supabase.com/docs/guides/platform/manage-your-usage/egress)
explain these labels.

Read-only database and Storage metadata inspection found:

| Observation | Result |
| --- | ---: |
| Article rows | 512 |
| Total article-body text | 104,476,699 bytes |
| Articles containing base64 image data | 149 |
| Largest published body | 3,896,840 bytes |
| Base64 cover-image fields | 0 |
| Article covers hosted on Cloudinary | 452 |
| Article covers referencing Supabase Storage | 34 |
| Storage objects in the images bucket | 74 |
| Total Storage object bytes | 36,941,563 |
| Largest Storage object | 2,605,508 bytes |
| Storage cache metadata | max-age=3600 |

These are logical body/object sizes, not monthly transfer. The reported 158 MB
database size includes other database overhead and is a different measurement.

Confirmed sources of avoidable work and bytes:

1. **Inline images in article bodies.** Full public article loads transferred
   base64 bytes from Postgres each time. The body was then rendered in both
   responsive article layouts and included in serialized page data. Embedded
   images had no independent browser/CDN cache identity.
2. **Unbounded slug lookup.** Each canonical article request downloaded every
   published article ID/title and resolved the slug in JavaScript. The sampled
   request returned 422 total rows across its queries.
3. **Pagination after downloading identifiers.** African Giant fetched both full
   category ID sets, combined them in JavaScript, then fetched one page.
4. **Repeated reads.** Public server loads had no application data cache or
   concurrent-request deduplication. Mobile and desktop comments each mounted
   and fetched the same list. The admin hook and layout independently read the
   same admin row, including unused password data.
5. **Overbroad lists and mutation responses.** The dashboard downloaded all posts
   even for the overview tab, filtering in the browser. Comment/subscriber lists
   were unbounded. Several API limits accepted arbitrarily large values. The
   movie list API returned complete reviews and could include drafts. Publishing
   updates returned article bodies even for a simple status/featured toggle.
6. **Optional UI downloading excess metadata.** The newsletter popup fetched the
   entire gallery to display three items. Homepage queries repeated the African
   Giant spotlight already present in its category section.

## Other services and background work

- Existing homepage/category cards and public search already omitted article
  bodies after earlier work. This audit retained those improvements and narrowed
  additional card projections. Full content remains available on public detail
  pages and private editors.
- Current image/video upload handlers use the existing Cloudinary account.
  They do not upload to Supabase Storage. Existing Storage URLs remain supported.
- No active Realtime subscriptions, Supabase Edge Function calls, database
  polling, or automatic query-retry library was found in application source.
  Carousel/progress timers animate local UI; they do not poll the database.
- The private Supabase SDK import in login was unused and was removed. Login
  continues using the existing local admin table and password verification.
  Remaining SDK examples/diagnostic scripts are not application request paths.
- The only checked-in scheduled workflow is daily-tech-news: at most four draft
  inserts per day, with external RSS/AI reads. It does not download the article
  dataset. Diagnostic/seed/backfill scripts are manual; none was run to mutate
  this database during the audit.
- Builds compile the application; they do not download all articles. The sitemap
  selects URL metadata, with its existing 1,000-row cap. It now caches that query.
  Plan a sitemap index if published URLs approach that existing cap.

Storage downloads remain a possible contributor, especially for the larger
objects. A one-hour cache lifetime alone does not establish excessive Storage
egress. The service breakdown is required before changing object metadata or
moving existing files.

## Implemented behavior

### Article bodies and media

Public article/movie detail queries replace supported raster data URIs **inside
Postgres**, before the bytes cross the network. Text, formatting and external
URLs are retained. An image becomes a URL such as
`/api/article-media/posts/<article-id>/<content-fingerprint>`.

The endpoint selects only that fingerprint-matching image from a published,
undeleted article, decodes base64 to binary in Postgres, and sends the matching
image MIME type with nosniff. It does not retrieve the whole body into Node to
extract the image. Unknown media formats/other embeds remain unchanged.

Fingerprint URLs use a one-year immutable browser cache and a one-day Vercel CDN
cache. Different image bytes produce a different URL. Existing stored bodies and
editor data are untouched by public reads. Already delivered public images can
remain in browser caches, as with existing public media URLs.

Images inside public article/review HTML now load lazily and decode asynchronously
unless explicit attributes were already supplied. Video previews avoid automatic
video downloading. Existing media URLs are not rewritten to a new host.

On an explicit future editor save, inline raster images from paste/drop/compressor
are uploaded through the existing Cloudinary configuration and replaced with
URLs. Identical images within a save are uploaded once; deterministic asset IDs
avoid creating another asset for the same bytes. Upload failure prevents the
article save. No bulk migration or external upload was performed during QA.

### Queries, pagination and privacy

- Article slug normalization runs in SQL and returns at most one ID/title. Its
  output was checked against the JavaScript URL helper for all 512 stored titles,
  including edge-case fixtures. UUID redirects and existing canonical URLs remain.
  The expression still scans titles in Postgres; an indexed persisted slug can be
  considered later if CPU/query timing warrants it.
- African Giant uses SQL EXISTS for both category systems, SQL COUNT, and SQL
  LIMIT/OFFSET. Duplicate category mappings cannot duplicate articles.
- Homepage cards share an explicit projection and reuse the Giant section for
  its spotlight. Admin movie lists omit review bodies. Post create/update
  responses return small metadata rather than echoing complete bodies.
- Dashboard post lists load only on the posts tab, 25 per page. Search, status,
  owner/all and author filters apply in SQL; existing manage-owner controls remain.
  Movies, videos, impact items, moderation and subscribers have page controls.
  Public movies use 24 rows, videos 20, comments 20; API limits are capped at 50.
- Public comments return approved comments and display names without emails.
  Mobile/desktop components share one browser resource and refresh together after
  submission. Its browser freshness is 30 seconds; pagination remains available.
- Search keeps its body-text matching in SQL and returns at most ten cards.
  Browser search is debounced and aborts obsolete requests on typing/close/unmount.
- Editors load one authorized article through a private server loader. The
  remaining editor API returns bodies only for single-post requests, restricted
  to the owner or super admin. Anonymous movie APIs exclude drafts.
- Admin layout authentication reuses the hook lookup. Admin/authenticated
  responses and editor APIs receive private, no-store headers. RLS and the
  authentication mechanism were not weakened.

### Cache freshness and invalidation

- Published, visitor-independent data is cached for **60 seconds** in each warm
  process. Concurrent identical reads share a promise. Cache memory is limited to
  128 entries / 16 MiB; individual entries over 512 KiB are not retained. Thrown
  errors are not cached. There is no new cache service or dependency.
- Authorization headers, admin cookies and Supabase auth cookies bypass this
  cache. Private/admin queries never enter it.
- Authorized content mutations clear the local public cache, including protection
  against old in-flight reads repopulating it. This covers publishing, editing,
  unpublishing, deletion, categories, gallery, video/movie writes and employee
  profile form actions. Anonymous failed writes cannot flush it.
- Public HTML/page data/search/gallery/video/sitemap CDN responses last 60 seconds
  with **no additional stale window**. Browsers revalidate. Old content can remain
  for about two minutes across process + CDN caches, plus work already in flight.
  Other serverless processes cannot be synchronously cleared by a local Map.
- Responses carry the `talkafrica-public` Vercel cache tag. Optional server-only
  purge credentials enable CDN invalidation after content writes. That API marks
  tagged copies stale; it does not clear other processes' Maps or guarantee an
  immediate globally fresh response. TTL expiry works without credentials.
  See [Vercel cache tags](https://vercel.com/changelog/tag-based-cache-invalidation-now-available-for-all-responses)
  and [the invalidation API](https://vercel.com/docs/rest-api/edge-cache/invalidate-by-tag).
- Existing `depends()` registrations execute even when data is reused. The editor
  invalidates client load data after saving.

## Measurements and validation

Before/after server-load samples used the same database and article identifier.
`result JSON bytes` means the sum of JSON-serialized rows returned by Drizzle,
before HTTP compression. It excludes PostgreSQL protocol/TLS overhead and media
downloads. Data can change between samples. This is **not Supabase billed egress**.

| Sample | Before queries / rows / result JSON bytes | After queries / rows / result JSON bytes |
| --- | ---: | ---: |
| Homepage | 17 / 101 / 95,468 | 16 / 100 / 86,329 |
| Sample article | 9 / 422 / 74,756 | 9 / 19 / 23,299 |
| African Giant page one | 3 / 83 / 17,290 | 2 / 13 / 13,487 |
| Immediate repeat of each in a warm process | Same database reads again | 0 / 0 / 0 |

The sampled article's query-result JSON fell about 69%. The largest published
body measured **3,896,840 -> 2,658 bytes** of content text when embedded images
became separate references. Images still transfer as binary on a cache miss;
that change is not a 99.9% reduction in total first-visit media transfer.

Validation completed:

- **36 regression tests passed**, covering existing navigation/tracking/search,
  bounded SQL, cache expiry/coalescing/invalidation, private-cache exclusions,
  ownership/role restrictions, comment request sharing, image responses and
  mocked create/edit/upload-failure behavior.
- `npm run check`: **0 errors; 65 existing warnings**.
- Production compilation and Vercel adapter packaging completed. The normal build
  hits an existing Windows EPERM symlink restriction; packaging was verified with
  a temporary process-local junction shim in ignored `.cache/`. No adapter source,
  package manifest or deployment configuration was modified for this workaround.
- Chrome verified homepage hydration, no hover page-data request, article-to-
  article and Back navigation, a single comment request per article, real decoding
  of the large article's extracted image, and the anonymous admin login redirect.
  Five tracking requests were intercepted; **0 JS exceptions / 0 real stats writes**.
  External-host media were blocked for this focused check.
- Local production HTTP checks verified public cache headers and cookie-free
  responses, bounded search, sitemap, movie/video API limits, private editor 401,
  admin redirect, authorization cache isolation and malformed-media 404.
- SQL image substitution round-tripped a two-image HTML fixture exactly, including
  its external image URL. All 512 database titles matched canonical JS slugs.

Actual authenticated publishing against production, Vercel CDN HIT behavior,
tag-purge credentials and monthly account usage remain unverified. The tests did
not log in with real credentials, publish test articles, or mutate live content.

Reproduce focused checks:

```powershell
node --import tsx --test --test-concurrency=1 scripts/origin-transfer.test.ts scripts/navigation.test.ts scripts/egress.test.ts
npm run check
npm run build
node --import tsx scripts/measure-supabase-egress.ts
node --import tsx scripts/measure-supabase-egress.ts --pages-only
node --import tsx scripts/measure-supabase-egress.ts --media-only
```

The diagnostic script requires the existing local environment. It prints
aggregates, request/result counts and sizes, never credentials or article bodies.
It performs real read-only database queries, so use it deliberately rather than
as frequent monitoring.

## Remaining configuration and rollout

1. Publish through the normal Vercel workflow and verify the deployment's commit
   status. The initial audit did not deploy; usage changes require the code to be live.
2. No Supabase migration, RLS change or Storage rewrite is required. Keep the
   existing Cloudinary configuration for editor image uploads.
3. Optional: configure `VERCEL_CACHE_PURGE_TOKEN`, `VERCEL_PROJECT_ID` and, for a
   team project, `VERCEL_TEAM_ID` in server-only Vercel environment variables.
   `.env.example` documents them. Use a token authorized for the intended project;
   never expose it via a PUBLIC_ variable. Without these, use the bounded TTLs.
4. After deployment, request the same public HTML and `__data.json` from the same
   region. Confirm no Set-Cookie and subsequent x-vercel-cache HIT behavior.
   Publish/edit through the normal UI, verify cards/search/detail refresh within
   the documented window, and confirm admin responses remain private, no-store.
   Test a pasted/compressed image save using the real editor when publishing real
   content, rather than adding disposable production content for this audit.
5. If Storage dominates measured traffic, inspect the largest objects and their
   download counts/cache headers. For immutable public objects, a longer cache
   lifetime may help. Use a new filename when changing image bytes; preserve
   existing URLs and check quota/feature availability before using transformations.

## Daily monitoring and downgrade decision

Open Supabase Usage, select **TalkAfrica's project**, set the billing-cycle dates,
and inspect each day's service breakdown. Organization totals include other
projects; cached egress is a separate allowance. Supabase documents these controls
and the Free plan's 5 GB uncached allowance in its
[egress usage guide](https://supabase.com/docs/guides/platform/manage-your-usage/egress).

Record daily uncached usage, cached usage, Shared Pooler, Database API, Storage and
other service totals, alongside site traffic and publishing activity. Compare the
seven-day average and busiest days after deployment. Use Vercel function traffic
and cache hits to explain changes; investigate frequent SQL queries if Shared
Pooler dominates, or object downloads if Storage dominates.

A practical headroom target is **3.5 GB per 31-day cycle**, approximately **113 MB
per day**, rather than consuming the full 5 GB. Forecast with observed daily
usage x cycle length, allow for spikes and expected growth, and check every other
Free-plan constraint before downgrading. Prefer a complete representative cycle
with margin. Local warm-cache measurements alone cannot establish sustainability.

The approximately 11.7 GB already recorded is not erased by these fixes. With the
reported cycle ending 17 November, evaluate future usage and the next cycle;
optimizations only reduce transfer served after the changes take effect.

## Files affected

The source inventory below excludes generated framework files, dependencies and
ignored local QA artifacts that were already present or produced by checks.

- `.env.example`
- `scripts/egress.test.ts`
- `scripts/measure-supabase-egress.ts`
- `scripts/navigation.test.ts`
- `scripts/origin-transfer.test.ts`
- `src/hooks.server.ts`
- `src/lib/comments.ts`
- `src/lib/components/CommentSection.svelte`
- `src/lib/components/Header.svelte`
- `src/lib/components/NewsletterPopup.svelte`
- `src/lib/components/Pagination.svelte`
- `src/lib/components/PopularVideos.svelte`
- `src/lib/server/article-media.ts`
- `src/lib/server/impact-gallery.ts`
- `src/lib/server/invalidate-public-content.ts`
- `src/lib/server/movie-reviews.ts`
- `src/lib/server/pagination.ts`
- `src/lib/server/post-cards.ts`
- `src/lib/server/post-slug.ts`
- `src/lib/server/public-cache.ts`
- `src/lib/server/public-data-cache.ts`
- `src/lib/server/store-inline-images.ts`
- `src/lib/server/videos.ts`
- `src/lib/utils/article-html.ts`
- `src/routes/+page.server.ts`
- `src/routes/[category=category]/+page.server.ts`
- `src/routes/about/+page.server.ts`
- `src/routes/admin/+layout.server.ts`
- `src/routes/admin/+page.server.ts`
- `src/routes/admin/+page.svelte`
- `src/routes/admin/comments/+page.server.ts`
- `src/routes/admin/comments/+page.svelte`
- `src/routes/admin/impact/+page.server.ts`
- `src/routes/admin/impact/+page.svelte`
- `src/routes/admin/movies/+page.server.ts`
- `src/routes/admin/movies/+page.svelte`
- `src/routes/admin/posts/new/+page.server.ts`
- `src/routes/admin/posts/new/+page.svelte`
- `src/routes/admin/videos/+page.server.ts`
- `src/routes/admin/videos/+page.svelte`
- `src/routes/african-giant/+page.server.ts`
- `src/routes/api/article-media/[kind]/[id]/[hash]/+server.ts`
- `src/routes/api/auth/login/+server.ts`
- `src/routes/api/movie-reviews/+server.ts`
- `src/routes/api/movie-reviews/[id]/+server.ts`
- `src/routes/api/newsletter/subscribers/+server.ts`
- `src/routes/api/our-impact/+server.ts`
- `src/routes/api/posts/+server.ts`
- `src/routes/api/posts/[postId]/comments/+server.ts`
- `src/routes/api/search/+server.ts`
- `src/routes/api/videos/+server.ts`
- `src/routes/emergence/+page.server.ts`
- `src/routes/movies/+page.server.ts`
- `src/routes/movies/+page.svelte`
- `src/routes/movies/[slug]/+page.server.ts`
- `src/routes/movies/[slug]/+page.svelte`
- `src/routes/posts/[post_id]/+page.server.ts`
- `src/routes/sitemap.xml/+server.ts`
- `src/routes/videos/+page.server.ts`
- `src/routes/videos/+page.svelte`
