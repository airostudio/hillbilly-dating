"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ProfileView, MessageView, RelationshipIntention } from "@/types";
import { DEMO_PROFILES } from "@/lib/demo-data";

const STORAGE_KEY = "hillbilly-demo-store-v1";

export const YOU_PROFILE_ID = "you";

const DEFAULT_ME: ProfileView = {
  id: YOU_PROFILE_ID,
  firstName: "Ashley",
  age: 28,
  gender: "woman",
  pronouns: "she/her",
  bio: "New around here — still filling out my profile, but I love a good bonfire and a bad country song sung loudly.",
  occupation: "",
  heightCm: undefined,
  city: "Franklin",
  state: "TN",
  relationshipIntention: "dating",
  verified: false,
  photos: [],
  interests: [],
  prompts: [],
  profileComplete: false,
};

interface LikeRecord {
  profileId: string;
  type: "like" | "super_like";
  createdAt: string;
}

interface StoredState {
  me: ProfileView;
  onboarded: boolean;
  likesGiven: LikeRecord[];
  passes: string[];
  incomingLikes: string[];
  messages: Record<string, MessageView[]>;
  preferences: {
    interestedIn: "men" | "women" | "everyone";
    minAge: number;
    maxAge: number;
    maxDistance: number;
    intentions: RelationshipIntention[];
    dealbreakerInterests: string[];
  };
}

function defaultState(): StoredState {
  return {
    me: DEFAULT_ME,
    onboarded: false,
    likesGiven: [],
    passes: [],
    // Two demo users already like "you" so the Likes/Matches pages have content.
    incomingLikes: ["2", "6"],
    messages: {},
    preferences: {
      interestedIn: "everyone",
      minAge: 21,
      maxAge: 45,
      maxDistance: 50,
      intentions: [],
      dealbreakerInterests: [],
    },
  };
}

interface MatchInfo {
  matchId: string;
  profile: ProfileView;
  matchedAt: string;
}

interface DemoStoreValue {
  me: ProfileView;
  onboarded: boolean;
  preferences: StoredState["preferences"];
  updateMe: (patch: Partial<ProfileView>) => void;
  completeOnboarding: (profile: ProfileView) => void;
  updatePreferences: (patch: Partial<StoredState["preferences"]>) => void;
  likeProfile: (profileId: string, type?: "like" | "super_like") => { matched: boolean };
  passProfile: (profileId: string) => void;
  hasLiked: (profileId: string) => boolean;
  hasPassed: (profileId: string) => boolean;
  matches: MatchInfo[];
  likesYou: ProfileView[];
  youLiked: ProfileView[];
  getConversation: (matchId: string) => MessageView[];
  sendMessage: (matchId: string, body: string) => void;
  discoverCandidates: ProfileView[];
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

function loadState(): StoredState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as StoredState;
    return { ...defaultState(), ...parsed, me: { ...DEFAULT_ME, ...parsed.me } };
  } catch {
    return defaultState();
  }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount to avoid an SSR hydration
    // mismatch (the server always renders defaultState()).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const profileById = useCallback(
    (id: string) => DEMO_PROFILES.find((p) => p.id === id),
    [],
  );

  const updateMe = useCallback((patch: Partial<ProfileView>) => {
    setState((prev) => ({ ...prev, me: { ...prev.me, ...patch } }));
  }, []);

  const completeOnboarding = useCallback((profile: ProfileView) => {
    setState((prev) => ({ ...prev, me: profile, onboarded: true }));
  }, []);

  const updatePreferences = useCallback((patch: Partial<StoredState["preferences"]>) => {
    setState((prev) => ({ ...prev, preferences: { ...prev.preferences, ...patch } }));
  }, []);

  const hasLiked = useCallback(
    (profileId: string) => state.likesGiven.some((l) => l.profileId === profileId),
    [state.likesGiven],
  );

  const hasPassed = useCallback(
    (profileId: string) => state.passes.includes(profileId),
    [state.passes],
  );

  const likeProfile = useCallback(
    (profileId: string, type: "like" | "super_like" = "like") => {
      const matched = state.incomingLikes.includes(profileId);
      setState((prev) => {
        if (prev.likesGiven.some((l) => l.profileId === profileId)) return prev;
        return {
          ...prev,
          likesGiven: [
            ...prev.likesGiven,
            { profileId, type, createdAt: new Date().toISOString() },
          ],
        };
      });
      return { matched };
    },
    [state.incomingLikes],
  );

  const passProfile = useCallback((profileId: string) => {
    setState((prev) =>
      prev.passes.includes(profileId) ? prev : { ...prev, passes: [...prev.passes, profileId] },
    );
  }, []);

  const matches = useMemo<MatchInfo[]>(() => {
    return state.likesGiven
      .filter((l) => state.incomingLikes.includes(l.profileId))
      .map((l) => {
        const profile = profileById(l.profileId);
        if (!profile) return null;
        return { matchId: l.profileId, profile, matchedAt: l.createdAt };
      })
      .filter((m): m is MatchInfo => m !== null);
  }, [state.likesGiven, state.incomingLikes, profileById]);

  const likesYou = useMemo(() => {
    const likedIds = new Set(state.likesGiven.map((l) => l.profileId));
    return state.incomingLikes
      .filter((id) => !likedIds.has(id))
      .map((id) => profileById(id))
      .filter((p): p is ProfileView => Boolean(p));
  }, [state.incomingLikes, state.likesGiven, profileById]);

  const youLiked = useMemo(() => {
    return state.likesGiven
      .map((l) => profileById(l.profileId))
      .filter((p): p is ProfileView => Boolean(p));
  }, [state.likesGiven, profileById]);

  const getConversation = useCallback(
    (matchId: string) => state.messages[matchId] ?? [],
    [state.messages],
  );

  const sendMessage = useCallback((matchId: string, body: string) => {
    setState((prev) => {
      const existing = prev.messages[matchId] ?? [];
      const newMessage: MessageView = {
        id: `${matchId}-${existing.length}-${Date.now()}`,
        senderId: YOU_PROFILE_ID,
        body,
        createdAt: new Date().toISOString(),
        isMe: true,
      };
      return {
        ...prev,
        messages: { ...prev.messages, [matchId]: [...existing, newMessage] },
      };
    });
  }, []);

  const discoverCandidates = useMemo(() => {
    const excluded = new Set([
      ...state.likesGiven.map((l) => l.profileId),
      ...state.passes,
    ]);
    return DEMO_PROFILES.filter((p) => !excluded.has(p.id));
  }, [state.likesGiven, state.passes]);

  const value: DemoStoreValue = {
    me: state.me,
    onboarded: state.onboarded,
    preferences: state.preferences,
    updateMe,
    completeOnboarding,
    updatePreferences,
    likeProfile,
    passProfile,
    hasLiked,
    hasPassed,
    matches,
    likesYou,
    youLiked,
    getConversation,
    sendMessage,
    discoverCandidates,
  };

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider");
  return ctx;
}
