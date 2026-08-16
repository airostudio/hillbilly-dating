# HillBilly Dating

**Find your forever porch partner.** A dating web app for country-loving singles, built with Next.js (App Router), TypeScript, hand-rolled CSS, and Supabase.

## Tech stack

- Next.js 16 (App Router, Server Components by default)
- TypeScript
- Hand-rolled CSS (CSS Modules + design tokens in `app/globals.css` — no CSS framework)
- Supabase (auth, Postgres, storage)
- React Hook Form + Zod
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Running without Supabase

The app ships with a **client-side demo store** (`lib/demo-store.tsx`, backed by
`localStorage`) and 12 fictional seeded profiles (`lib/demo-data.ts`). Without any
environment variables set, you can sign up, complete onboarding, swipe in Discover,
match, and message — entirely in the browser, no backend required. This is what
makes `npm run dev` immediately usable out of the box.

### Connecting real Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
3. Run the migrations in `supabase/migrations/` in order (via the Supabase SQL editor,
   or `supabase db push` with the CLI):
   - `0001_init.sql` — tables, enums, constraints
   - `0002_functions.sql` — helper functions + auto-match trigger
   - `0003_rls.sql` — Row Level Security policies + storage buckets/policies
4. Run `supabase/seed.sql` to load lifestyle interests and profile prompts.
5. (Optional) Enable Google OAuth in Supabase Auth settings to activate the Google
   sign-in button on `/login` and `/signup`.

Once configured, auth pages use real Supabase auth instead of the demo-mode fallback,
and middleware (`middleware.ts`) protects app routes by redirecting unauthenticated
users to `/login`.

## Database & security

Schema covers `profiles`, `profile_photos`, `interests`/`profile_interests`,
`prompts`/`profile_prompt_answers`, `preferences`, `likes`, `passes`, `matches`,
`messages`, `blocks`, and `reports` — see `supabase/migrations/0001_init.sql`.

Row Level Security (`supabase/migrations/0003_rls.sql`) enforces:

- Users can only insert/update their **own** profile, photos, interests, prompt
  answers, and preferences.
- Discovery reads exclude hidden, paused, suspended, or blocked profiles.
- Likes/passes/messages/reports can only be created **as yourself** — sender/reporter
  ids are always resolved server-side via `current_profile_id()`, so a user cannot
  impersonate another user.
- Only the two participants in a match (and only while it's not unmatched) can read
  or write that match's messages.
- Matches are created only by a `security definer` trigger that fires when two
  profiles have both liked each other — there is no direct insert policy for
  `matches`, so clients cannot fabricate a match.
- Storage policies scope profile-photo and message-image writes to a folder named
  after the uploader's own profile id.

A profile's exact coordinates, email, and phone number are never exposed to other
users — only city/state (and an optional computed distance) are shown publicly.

## Matching

`lib/matching/recommend.ts` filters candidates (gender preference, age range,
distance, relationship intention, blocked/matched/passed) and then applies a
transparent, intentionally simple compatibility score (shared interests, matching
relationship goals, distance, profile completeness, verification). It's built as a
standalone module specifically so the scoring logic can be swapped out or upgraded
without touching any page code.

## Project structure

```
app/
  (marketing)/       Public landing page + footer/header chrome
  (auth)/             Login, signup, forgot password
  (app)/              Authenticated app (Navbar/BottomNav chrome): discover, matches,
                       messages, likes, profile, settings
  onboarding/         Multi-step onboarding wizard
components/
  ui/                 Hand-rolled primitives: Button, Card, Input, Chip, Dialog, Tabs, Toast…
  dating/             Domain components: ProfileCard, MatchModal, ConversationList…
  layout/             Navbar, BottomNav, MarketingHeader, Footer
lib/
  supabase/           Browser/server Supabase clients + middleware helper
  matching/           Recommendation engine
  validation/         Zod schemas
  demo-data.ts        Seeded fictional profiles
  demo-store.tsx       Client-side demo state (localStorage)
types/                 Database + view-model TypeScript types
supabase/
  migrations/         SQL schema + RLS
  seed.sql            Reference data (interests, prompts)
```

## Scripts

```bash
npm run dev     # start dev server
npm run build   # production build
npm run lint    # eslint
```
