# Fast Origin Transfer audit

Inspected TalkAfrica's source and `https://talkafricang.com` on 1 November 2026.
This report records the source fixes and validation. Vercel account usage charts and
request logs were not available, so this identifies confirmed inefficiencies,
not the exact share of this month's allowance caused by each one.

## Findings

- Public HTML and SvelteKit page-data requests set visitor/session cookies.
  Live homepage and category requests returned `x-vercel-cache: MISS`, and page
  data used `Cache-Control: private, no-store`. Vercel does not cache responses
  that set cookies. Existing `vercel.json` headers only covered static assets.
- Homepage queries returned full article and movie-review bodies for preview
  cards. That text was serialized into page data even though cards didn't use it.
- Link hovering prefetched server data, including pages never actually opened.
- Header search used an unbounded API that included full article bodies.
  The same endpoint could be requested anonymously without a search term.
- Article/movie view counting ran inside page loads, tying analytics to origin
  execution and counting preloads as views.

## Changes

- Explicit public routes, including their `__data.json` responses, now use a
  Vercel CDN cache lifetime of 60 seconds with 300 seconds of background
  revalidation. Browsers still revalidate. Admin routes, editor APIs, writes,
  authorization-bearing requests, and unsuccessful responses are excluded.
- Visitor/session and view counting moved to a small, same-origin `POST /api/track`
  after actual browser navigation. It returns an empty, uncached response.
  Article counters retain cookie deduplication and update daily totals together.
  Bots and readers without JavaScript no longer contribute to these counters.
- Removed unused bodies from homepage cards, movie lists and related movies.
- Public search now returns at most 10 published, undeleted article previews.
  The full `/api/posts` editor response requires an admin session.
- Changed link preloading from hover to tap/click.
- Fixed the shared Emergence loader types and a slideshow callback that threw
  during browser navigation, both discovered during verification.

## Measurements

Response body sizes before compression, comparing live production with the local
production build against the same content database. Content can change between
requests; these are response-size measurements, not billing totals.

| Response | Live before changes | Local production after changes | Reduction |
| --- | ---: | ---: | ---: |
| Homepage HTML | 583,713 bytes | 343,242 bytes | 41% |
| Homepage page data | 263,550 bytes | 70,730 bytes | 73% |

Public responses in the local build no longer set visitor cookies and contain
`Vercel-CDN-Cache-Control: public, s-maxage=60, stale-while-revalidate=300`.
Public search returned 10 previews in 9,045 bytes with no article-body fields.
The admin page continued redirecting unauthenticated requests to login.

## Validation

- Nine focused regression tests passed. Run them with
  `node --import tsx --test scripts/origin-transfer.test.ts`.
- `npm run check`: zero errors; 65 existing warnings remain.
- Production compilation and Vercel adapter packaging passed. On this Windows
  machine, packaging needed a temporary directory-junction workaround for the
  adapter's symlinks; the production adapter source was not modified.
- Chrome verified initial hydration, client article navigation, no data fetch
  on hover, and the admin login redirect without JavaScript exceptions.
  Tracking requests were intercepted so this check wrote no real visitor stats.

## Deployment follow-up

1. Deploy the source changes through the normal Vercel workflow.
2. Request the same public page and its `__data.json` endpoint repeatedly from
   the same region. Check for `x-vercel-cache: HIT` or `STALE` after the initial
   miss, and confirm these responses have no `Set-Cookie` header.
3. Expect published content changes to take up to six minutes to propagate with
   the selected cache policy. Visitor counters continue updating separately.
4. In Vercel Usage, filter Fast Origin Transfer to this project and compare
   incoming/outgoing traffic and function invocations after deployment. If
   incoming traffic dominates, inspect media-upload traffic separately.

These changes reduce future transfer; they do not erase usage already recorded
or establish whether actual traffic fits within the plan's allowance.

References: [Vercel CDN cache criteria](https://vercel.com/docs/caching/cdn-cache#cacheable-response-criteria),
[origin transfer optimization](https://vercel.com/docs/manage-cdn-usage#optimizing-fast-origin-transfer),
[cache headers](https://vercel.com/docs/caching/cache-control-headers),
[Hobby plan allowances](https://vercel.com/docs/plans/hobby).

## Navigation delay follow-up

The router waits for server data before replacing the page. The article route
performed several sequential database reads, and 12 article links explicitly
forced a full document reload using `data-sveltekit-reload`.

- Removed those forced reloads. Article navigation now preserves the document.
- Combined independent article reads and bounded related/sidebar queries in SQL.
  Fallbacks reuse existing results rather than issuing additional serial reads.
- Category pages now filter membership and count posts in SQL, with main content
  and child sections fetched concurrently rather than downloading all matching IDs.
- Page code can preload on hover; database-backed page data still preloads only
  on tap/click. The progress bar responds immediately.
- Comments reset for each article, movie details react to new route data, and
  share controls reset during article navigation.

Warm local production requests to the same database improved from roughly
1.5 seconds to 0.8 seconds for the sampled category, and from 4.7 seconds to
3.0–3.7 seconds for the sampled article. Initial requests still reached about
5 seconds: these local timings include remote database/network and connection
setup costs, and do not measure a deployed Vercel CDN cache hit.

Before/after comparisons preserved the sampled article body, categories, related
posts, previous/next destinations, sidebar content, category lists and pagination.
Seven navigation regression tests passed (`node --import tsx --test scripts/navigation.test.ts`),
as did production packaging and the type checker (zero errors, 65 existing warnings).
Chrome verified article-to-article and Back navigation without a document reload,
correct title/comment updates and no JavaScript exceptions. Tracking was intercepted
to avoid writing real visit statistics. Repeat the live checks after deployment.

Framework references: [SvelteKit link behavior](https://svelte.dev/docs/kit/link-options),
[server loading and navigation](https://svelte.dev/docs/kit/load#Parallel-loading).
