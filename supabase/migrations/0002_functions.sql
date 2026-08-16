-- Helper functions + auto-matching trigger

-- Returns the profile id belonging to the currently authenticated user.
create or replace function current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from profiles where user_id = auth.uid();
$$;

-- True if `a` has blocked `b` or `b` has blocked `a`.
create or replace function is_blocked_between(a uuid, b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from blocks
    where (blocker_id = a and blocked_id = b)
       or (blocker_id = b and blocked_id = a)
  );
$$;

-- True if the current user is part of the given match and it's still active.
create or replace function is_match_participant(match_id_input uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from matches m
    where m.id = match_id_input
      and m.unmatched_at is null
      and current_profile_id() in (m.profile_one_id, m.profile_two_id)
  );
$$;

-- Auto-create a match when two profiles have both liked each other.
create or replace function handle_new_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  reciprocal_exists boolean;
  ordered_one uuid;
  ordered_two uuid;
begin
  select exists (
    select 1 from likes
    where sender_id = new.receiver_id and receiver_id = new.sender_id
  ) into reciprocal_exists;

  if reciprocal_exists and not is_blocked_between(new.sender_id, new.receiver_id) then
    if new.sender_id < new.receiver_id then
      ordered_one := new.sender_id;
      ordered_two := new.receiver_id;
    else
      ordered_one := new.receiver_id;
      ordered_two := new.sender_id;
    end if;

    insert into matches (profile_one_id, profile_two_id)
    values (ordered_one, ordered_two)
    on conflict (profile_one_id, profile_two_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger likes_after_insert
  after insert on likes
  for each row execute function handle_new_like();
