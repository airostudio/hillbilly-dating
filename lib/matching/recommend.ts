import type { ProfileView, RelationshipIntention } from "@/types";

/**
 * Candidate filtering + a simple, transparent compatibility score.
 * This is intentionally not "scientific" — it's a heuristic starting point
 * that can be swapped for a smarter model later without touching callers.
 */

export interface ViewerContext {
  profile: ProfileView;
  interestedIn: "men" | "women" | "everyone";
  minAge: number;
  maxAge: number;
  maxDistance: number;
  intentions: RelationshipIntention[];
  blockedProfileIds: Set<string>;
  matchedProfileIds: Set<string>;
  passedProfileIds: Set<string>;
}

function genderMatchesPreference(
  candidateGender: ProfileView["gender"],
  interestedIn: ViewerContext["interestedIn"],
): boolean {
  if (interestedIn === "everyone") return true;
  if (interestedIn === "men") return candidateGender === "man";
  if (interestedIn === "women") return candidateGender === "woman";
  return true;
}

export function filterCandidates(
  candidates: ProfileView[],
  viewer: ViewerContext,
): ProfileView[] {
  return candidates.filter((candidate) => {
    if (candidate.id === viewer.profile.id) return false;
    if (viewer.blockedProfileIds.has(candidate.id)) return false;
    if (viewer.matchedProfileIds.has(candidate.id)) return false;
    if (viewer.passedProfileIds.has(candidate.id)) return false;
    if (candidate.age < viewer.minAge || candidate.age > viewer.maxAge) return false;
    if (
      typeof candidate.distanceMiles === "number" &&
      candidate.distanceMiles > viewer.maxDistance
    ) {
      return false;
    }
    if (!genderMatchesPreference(candidate.gender, viewer.interestedIn)) return false;
    if (
      viewer.intentions.length > 0 &&
      !viewer.intentions.includes(candidate.relationshipIntention)
    ) {
      return false;
    }
    return true;
  });
}

export interface ScoredProfile {
  profile: ProfileView;
  score: number;
  reasons: string[];
}

/** Score is 0-100, purely a rough compatibility signal — not predictive. */
export function scoreCandidate(candidate: ProfileView, viewer: ProfileView): ScoredProfile {
  const reasons: string[] = [];
  let score = 0;

  const sharedInterests = candidate.interests.filter((i) => viewer.interests.includes(i));
  const interestScore = Math.min(sharedInterests.length * 10, 40);
  score += interestScore;
  if (sharedInterests.length > 0) {
    reasons.push(`${sharedInterests.length} shared interest${sharedInterests.length > 1 ? "s" : ""}`);
  }

  if (candidate.relationshipIntention === viewer.relationshipIntention) {
    score += 20;
    reasons.push("Same relationship goals");
  }

  if (typeof candidate.distanceMiles === "number") {
    const distanceScore = Math.max(0, 20 - candidate.distanceMiles);
    score += distanceScore;
    if (candidate.distanceMiles <= 10) reasons.push("Nearby");
  } else {
    score += 10;
  }

  if (candidate.profileComplete) {
    score += 10;
  }
  if (candidate.verified) {
    score += 10;
    reasons.push("Verified profile");
  }

  return { profile: candidate, score: Math.min(Math.round(score), 100), reasons };
}

export function rankCandidates(candidates: ProfileView[], viewer: ProfileView): ScoredProfile[] {
  return candidates
    .map((candidate) => scoreCandidate(candidate, viewer))
    .sort((a, b) => b.score - a.score);
}

export function getRecommendations(
  candidates: ProfileView[],
  viewer: ViewerContext,
): ScoredProfile[] {
  const filtered = filterCandidates(candidates, viewer);
  return rankCandidates(filtered, viewer.profile);
}
