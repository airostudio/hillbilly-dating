-- Row Level Security policies
--
-- Principles:
--   * Users can only modify their own profile / owned rows.
--   * Discovery reads exclude blocked users and hidden/paused/suspended profiles.
--   * Only matched participants can read/write messages for that match.
--   * Users cannot create likes/passes/messages/reports impersonating someone else —
--     sender/reporter/blocker ids are always resolved server-side via current_profile_id().

alter table profiles enable row level security;
alter table profile_photos enable row level security;
alter table interests enable row level security;
alter table profile_interests enable row level security;
alter table prompts enable row level security;
alter table profile_prompt_answers enable row level security;
alter table preferences enable row level security;
alter table likes enable row level security;
alter table passes enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;
alter table blocks enable row level security;
alter table reports enable row level security;

-- profiles --------------------------------------------------------------------

create policy "profiles_select_self" on profiles
  for select using (user_id = auth.uid());

create policy "profiles_select_discoverable" on profiles
  for select using (
    not hide_profile
    and not paused
    and not suspended
    and not is_blocked_between(id, current_profile_id())
  );

create policy "profiles_insert_self" on profiles
  for insert with check (user_id = auth.uid());

create policy "profiles_update_self" on profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- profile_photos ----------------------------------------------------------------

create policy "profile_photos_select" on profile_photos
  for select using (
    profile_id in (select id from profiles where user_id = auth.uid())
    or profile_id in (
      select id from profiles
      where not hide_profile and not paused and not suspended
        and not is_blocked_between(id, current_profile_id())
    )
  );

create policy "profile_photos_write_self" on profile_photos
  for all using (profile_id = current_profile_id())
  with check (profile_id = current_profile_id());

-- interests / prompts (public reference data) ------------------------------------

create policy "interests_select_all" on interests for select using (true);
create policy "prompts_select_active" on prompts for select using (active);

-- profile_interests ---------------------------------------------------------------

create policy "profile_interests_select" on profile_interests
  for select using (true);

create policy "profile_interests_write_self" on profile_interests
  for all using (profile_id = current_profile_id())
  with check (profile_id = current_profile_id());

-- profile_prompt_answers -----------------------------------------------------------

create policy "prompt_answers_select" on profile_prompt_answers
  for select using (true);

create policy "prompt_answers_write_self" on profile_prompt_answers
  for all using (profile_id = current_profile_id())
  with check (profile_id = current_profile_id());

-- preferences (private) ------------------------------------------------------------

create policy "preferences_self_only" on preferences
  for all using (profile_id = current_profile_id())
  with check (profile_id = current_profile_id());

-- likes -------------------------------------------------------------------------------

create policy "likes_select_involving_self" on likes
  for select using (
    sender_id = current_profile_id() or receiver_id = current_profile_id()
  );

create policy "likes_insert_as_self" on likes
  for insert with check (
    sender_id = current_profile_id()
    and not is_blocked_between(sender_id, receiver_id)
  );

create policy "likes_delete_own" on likes
  for delete using (sender_id = current_profile_id());

-- passes -------------------------------------------------------------------------------

create policy "passes_select_own" on passes
  for select using (sender_id = current_profile_id());

create policy "passes_insert_as_self" on passes
  for insert with check (sender_id = current_profile_id());

-- matches -------------------------------------------------------------------------------

create policy "matches_select_participant" on matches
  for select using (
    current_profile_id() in (profile_one_id, profile_two_id)
  );

create policy "matches_update_unmatch" on matches
  for update using (
    current_profile_id() in (profile_one_id, profile_two_id)
  ) with check (
    current_profile_id() in (profile_one_id, profile_two_id)
  );

-- matches are inserted only by the handle_new_like() trigger (security definer),
-- so no direct insert policy is granted to end users.

-- messages -------------------------------------------------------------------------------

create policy "messages_select_participant" on messages
  for select using (is_match_participant(match_id));

create policy "messages_insert_participant" on messages
  for insert with check (
    sender_id = current_profile_id() and is_match_participant(match_id)
  );

create policy "messages_update_read_state" on messages
  for update using (is_match_participant(match_id))
  with check (is_match_participant(match_id));

-- blocks -------------------------------------------------------------------------------

create policy "blocks_select_own" on blocks
  for select using (blocker_id = current_profile_id());

create policy "blocks_insert_as_self" on blocks
  for insert with check (blocker_id = current_profile_id());

create policy "blocks_delete_own" on blocks
  for delete using (blocker_id = current_profile_id());

-- reports -------------------------------------------------------------------------------

create policy "reports_select_own" on reports
  for select using (reporter_id = current_profile_id());

create policy "reports_insert_as_self" on reports
  for insert with check (reporter_id = current_profile_id());

-- Storage --------------------------------------------------------------------------------
-- Bucket "profile-photos": path convention <profile_id>/<filename>.
-- Users may only write to a folder matching their own profile id; photos are
-- publicly readable (dating profile photos are meant to be seen) but read
-- access still respects who is allowed to see the profile at the app layer.

insert into storage.buckets (id, name, public)
values ('profile-photos', 'profile-photos', true)
on conflict (id) do nothing;

create policy "profile_photos_storage_read" on storage.objects
  for select using (bucket_id = 'profile-photos');

create policy "profile_photos_storage_write" on storage.objects
  for insert with check (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = current_profile_id()::text
  );

create policy "profile_photos_storage_update" on storage.objects
  for update using (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = current_profile_id()::text
  );

create policy "profile_photos_storage_delete" on storage.objects
  for delete using (
    bucket_id = 'profile-photos'
    and (storage.foldername(name))[1] = current_profile_id()::text
  );

insert into storage.buckets (id, name, public)
values ('message-images', 'message-images', false)
on conflict (id) do nothing;

create policy "message_images_storage_write" on storage.objects
  for insert with check (
    bucket_id = 'message-images'
    and (storage.foldername(name))[1] = current_profile_id()::text
  );

create policy "message_images_storage_read" on storage.objects
  for select using (
    bucket_id = 'message-images'
    and (
      (storage.foldername(name))[1] = current_profile_id()::text
      or exists (
        select 1 from messages msg
        join matches m on m.id = msg.match_id
        where msg.image_path = name
          and current_profile_id() in (m.profile_one_id, m.profile_two_id)
      )
    )
  );
