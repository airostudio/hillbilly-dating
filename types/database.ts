export type Gender = "man" | "woman" | "nonbinary" | "other";
export type InterestedIn = "men" | "women" | "everyone";
export type RelationshipIntention =
  | "long_term"
  | "marriage"
  | "dating"
  | "friendship"
  | "not_sure";
export type LikeType = "like" | "super_like";
export type ModerationStatus = "pending" | "approved" | "rejected";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  date_of_birth: string;
  gender: Gender;
  pronouns: string | null;
  bio: string | null;
  occupation: string | null;
  height_cm: number | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  relationship_intention: RelationshipIntention | null;
  verified: boolean;
  profile_complete: boolean;
  hide_profile: boolean;
  show_approximate_location: boolean;
  read_receipts_enabled: boolean;
  show_online_status: boolean;
  paused: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfilePhoto {
  id: string;
  profile_id: string;
  storage_path: string;
  position: number;
  is_primary: boolean;
  moderation_status: ModerationStatus;
  created_at: string;
}

export interface Interest {
  id: string;
  name: string;
  slug: string;
}

export interface ProfileInterest {
  profile_id: string;
  interest_id: string;
}

export interface Prompt {
  id: string;
  question: string;
  active: boolean;
}

export interface ProfilePromptAnswer {
  id: string;
  profile_id: string;
  prompt_id: string;
  answer: string;
  position: number;
}

export interface Preferences {
  profile_id: string;
  min_age: number;
  max_age: number;
  max_distance: number;
  interested_in: InterestedIn;
  intentions: RelationshipIntention[];
  dealbreaker_interests: string[] | null;
}

export interface Like {
  id: string;
  sender_id: string;
  receiver_id: string;
  type: LikeType;
  created_at: string;
}

export interface Pass {
  id: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

export interface Match {
  id: string;
  profile_one_id: string;
  profile_two_id: string;
  matched_at: string;
  unmatched_at: string | null;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  body: string | null;
  image_path: string | null;
  read_at: string | null;
  created_at: string;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      profile_photos: {
        Row: ProfilePhoto;
        Insert: Partial<ProfilePhoto>;
        Update: Partial<ProfilePhoto>;
      };
      interests: { Row: Interest; Insert: Partial<Interest>; Update: Partial<Interest> };
      profile_interests: {
        Row: ProfileInterest;
        Insert: Partial<ProfileInterest>;
        Update: Partial<ProfileInterest>;
      };
      prompts: { Row: Prompt; Insert: Partial<Prompt>; Update: Partial<Prompt> };
      profile_prompt_answers: {
        Row: ProfilePromptAnswer;
        Insert: Partial<ProfilePromptAnswer>;
        Update: Partial<ProfilePromptAnswer>;
      };
      preferences: { Row: Preferences; Insert: Partial<Preferences>; Update: Partial<Preferences> };
      likes: { Row: Like; Insert: Partial<Like>; Update: Partial<Like> };
      passes: { Row: Pass; Insert: Partial<Pass>; Update: Partial<Pass> };
      matches: { Row: Match; Insert: Partial<Match>; Update: Partial<Match> };
      messages: { Row: Message; Insert: Partial<Message>; Update: Partial<Message> };
      blocks: { Row: Block; Insert: Partial<Block>; Update: Partial<Block> };
      reports: { Row: Report; Insert: Partial<Report>; Update: Partial<Report> };
    };
  };
}
