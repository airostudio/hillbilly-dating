-- Reference data seed: interests + prompts.
-- Demo profiles are NOT seeded here because profiles.user_id must reference a
-- real auth.users row. The app ships with in-memory demo profiles
-- (see lib/demo-data.ts) so the UI looks complete without a live database.
-- To seed real demo accounts against a live Supabase project, create the
-- auth users first (e.g. via the Supabase dashboard or admin API), then
-- insert matching rows into `profiles` using their user ids.

insert into interests (name, slug) values
  ('Fishing', 'fishing'),
  ('Hunting', 'hunting'),
  ('Camping', 'camping'),
  ('Horses', 'horses'),
  ('Farming', 'farming'),
  ('Ranching', 'ranching'),
  ('Country Music', 'country-music'),
  ('Rodeos', 'rodeos'),
  ('Trucks', 'trucks'),
  ('Bonfires', 'bonfires'),
  ('Hiking', 'hiking'),
  ('Dogs', 'dogs'),
  ('Gardening', 'gardening'),
  ('Off-roading', 'off-roading'),
  ('BBQ', 'bbq'),
  ('Line Dancing', 'line-dancing'),
  ('Small-town Life', 'small-town-life'),
  ('Homesteading', 'homesteading')
on conflict (slug) do nothing;

insert into prompts (question) values
  ('My perfect Saturday looks like…'),
  ('The quickest way to my heart is…'),
  ('My ideal first date is…'),
  ('You should know that I…'),
  ('My most controversial country opinion is…'),
  ('I''ll bring the beer if you…'),
  ('My dream piece of land would have…'),
  ('A green flag I always notice is…'),
  ('My favorite thing about country life is…')
on conflict do nothing;
