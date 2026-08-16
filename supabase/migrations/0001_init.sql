-- HillBilly Dating — initial schema
-- Enums

create type gender as enum ('man', 'woman', 'nonbinary', 'other');
create type interested_in as enum ('men', 'women', 'everyone');
create type relationship_intention as enum ('long_term', 'marriage', 'dating', 'friendship', 'not_sure');
create type like_type as enum ('like', 'super_like');
create type moderation_status as enum ('pending', 'approved', 'rejected');
create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

-- profiles ------------------------------------------------------------------

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  first_name text not null,
  date_of_birth date not null,
  gender gender not null,
  pronouns text,
  bio text,
  occupation text,
  height_cm smallint,
  city text,
  state text,
  latitude double precision,
  longitude double precision,
  relationship_intention relationship_intention,
  verified boolean not null default false,
  profile_complete boolean not null default false,
  hide_profile boolean not null default false,
  show_approximate_location boolean not null default true,
  read_receipts_enabled boolean not null default true,
  show_online_status boolean not null default true,
  paused boolean not null default false,
  -- Admin moderation fields
  moderation_notes text,
  suspended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profile_is_adult check (date_of_birth <= (current_date - interval '18 years'))
);

create index profiles_user_id_idx on profiles (user_id);
create index profiles_location_idx on profiles (latitude, longitude);

-- profile_photos --------------------------------------------------------------

create table profile_photos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  storage_path text not null,
  position smallint not null default 0,
  is_primary boolean not null default false,
  moderation_status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index profile_photos_profile_id_idx on profile_photos (profile_id);
create unique index profile_photos_one_primary_idx on profile_photos (profile_id) where is_primary;

-- interests -------------------------------------------------------------------

create table interests (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table profile_interests (
  profile_id uuid not null references profiles (id) on delete cascade,
  interest_id uuid not null references interests (id) on delete cascade,
  primary key (profile_id, interest_id)
);

-- prompts -----------------------------------------------------------------------

create table prompts (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  active boolean not null default true
);

create table profile_prompt_answers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  prompt_id uuid not null references prompts (id) on delete cascade,
  answer text not null,
  position smallint not null default 0,
  unique (profile_id, prompt_id)
);

-- preferences ---------------------------------------------------------------------

create table preferences (
  profile_id uuid primary key references profiles (id) on delete cascade,
  min_age smallint not null default 18,
  max_age smallint not null default 99,
  max_distance smallint not null default 50,
  interested_in interested_in not null default 'everyone',
  intentions relationship_intention[] not null default '{}',
  dealbreaker_interests text[] not null default '{}',
  updated_at timestamptz not null default now(),
  constraint preferences_age_range check (min_age <= max_age)
);

-- likes / passes / matches -----------------------------------------------------------

create table likes (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles (id) on delete cascade,
  receiver_id uuid not null references profiles (id) on delete cascade,
  type like_type not null default 'like',
  created_at timestamptz not null default now(),
  unique (sender_id, receiver_id),
  constraint likes_no_self check (sender_id <> receiver_id)
);

create index likes_receiver_id_idx on likes (receiver_id);

create table passes (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references profiles (id) on delete cascade,
  receiver_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (sender_id, receiver_id),
  constraint passes_no_self check (sender_id <> receiver_id)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  profile_one_id uuid not null references profiles (id) on delete cascade,
  profile_two_id uuid not null references profiles (id) on delete cascade,
  matched_at timestamptz not null default now(),
  unmatched_at timestamptz,
  constraint matches_ordered_pair check (profile_one_id < profile_two_id),
  unique (profile_one_id, profile_two_id)
);

create index matches_profile_one_idx on matches (profile_one_id);
create index matches_profile_two_idx on matches (profile_two_id);

-- messages ---------------------------------------------------------------------------

create table messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches (id) on delete cascade,
  sender_id uuid not null references profiles (id) on delete cascade,
  body text,
  image_path text,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  constraint message_has_content check (body is not null or image_path is not null)
);

create index messages_match_id_idx on messages (match_id, created_at);

-- blocks / reports ---------------------------------------------------------------------

create table blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references profiles (id) on delete cascade,
  blocked_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  constraint blocks_no_self check (blocker_id <> blocked_id)
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id) on delete cascade,
  reported_id uuid not null references profiles (id) on delete cascade,
  reason text not null,
  details text,
  status report_status not null default 'open',
  created_at timestamptz not null default now(),
  constraint reports_no_self check (reporter_id <> reported_id)
);

-- updated_at trigger -------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();
