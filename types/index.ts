import type {
  Gender,
  InterestedIn,
  RelationshipIntention,
} from "./database";

export * from "./database";

export const INTENTION_LABELS: Record<RelationshipIntention, string> = {
  long_term: "Long-term relationship",
  marriage: "Marriage",
  dating: "Dating",
  friendship: "Friendship",
  not_sure: "Not sure yet",
};

export const GENDER_LABELS: Record<Gender, string> = {
  man: "Man",
  woman: "Woman",
  nonbinary: "Non-binary",
  other: "Other",
};

export const INTERESTED_IN_LABELS: Record<InterestedIn, string> = {
  men: "Men",
  women: "Women",
  everyone: "Everyone",
};

export interface PromptAnswerView {
  id: string;
  question: string;
  answer: string;
}

/** Denormalized profile shape used throughout the UI (discover, profile view, matches). */
export interface ProfileView {
  id: string;
  firstName: string;
  age: number;
  gender: Gender;
  pronouns?: string | null;
  bio: string;
  occupation?: string | null;
  heightCm?: number | null;
  city: string;
  state: string;
  distanceMiles?: number;
  relationshipIntention: RelationshipIntention;
  verified: boolean;
  online?: boolean;
  photos: string[];
  interests: string[];
  prompts: PromptAnswerView[];
  profileComplete: boolean;
}

export interface MatchView {
  id: string;
  profile: ProfileView;
  matchedAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unread: boolean;
}

export interface ConversationView {
  matchId: string;
  profile: ProfileView;
  online: boolean;
  messages: MessageView[];
}

export interface MessageView {
  id: string;
  senderId: string;
  body?: string;
  imageUrl?: string;
  createdAt: string;
  readAt?: string | null;
  isMe: boolean;
}
