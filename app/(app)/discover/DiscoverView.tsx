"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { getRecommendations } from "@/lib/matching/recommend";
import type { ViewerContext } from "@/lib/matching/recommend";
import type { RelationshipIntention } from "@/types";
import { INTENTION_LABELS } from "@/types";
import { ProfileCard } from "@/components/dating/ProfileCard";
import { PassButton, LikeButton, SuperLikeButton } from "@/components/dating/ActionButtons";
import { MatchModal } from "@/components/dating/MatchModal";
import { EmptyState } from "@/components/dating/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Chip } from "@/components/ui/Chip";
import { useToast } from "@/components/ui/Toast";
import styles from "./DiscoverView.module.css";

const ALL_INTENTIONS: RelationshipIntention[] = [
  "long_term",
  "marriage",
  "dating",
  "friendship",
  "not_sure",
];

export function DiscoverView() {
  const { me, preferences, discoverCandidates, likeProfile, passProfile } = useDemoStore();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [passedIds, setPassedIds] = useState<Set<string>>(new Set());
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<{ id: string; name: string; photo: string } | null>(
    null,
  );

  // Local, non-persisted filter UI layered on top of stored preferences.
  const [minAge, setMinAge] = useState(preferences.minAge);
  const [maxAge, setMaxAge] = useState(preferences.maxAge);
  const [maxDistance, setMaxDistance] = useState(preferences.maxDistance);
  const [intentions, setIntentions] = useState<RelationshipIntention[]>(preferences.intentions);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  function toggleIntention(intention: RelationshipIntention) {
    setIntentions((prev) =>
      prev.includes(intention) ? prev.filter((i) => i !== intention) : [...prev, intention],
    );
  }

  const ranked = useMemo(() => {
    const matchedProfileIds = new Set<string>();
    const viewer: ViewerContext = {
      profile: me,
      interestedIn: preferences.interestedIn,
      minAge,
      maxAge,
      maxDistance,
      intentions,
      blockedProfileIds: new Set<string>(),
      matchedProfileIds,
      passedProfileIds: passedIds,
    };
    return getRecommendations(discoverCandidates, viewer);
  }, [discoverCandidates, me, preferences.interestedIn, minAge, maxAge, maxDistance, intentions, passedIds]);

  const current = ranked[0];
  const upNext = ranked.slice(1, 5);

  function handlePass(id: string) {
    passProfile(id);
    setPassedIds((prev) => new Set(prev).add(id));
  }

  function handleLike(id: string, name: string, photo: string, type: "like" | "super_like") {
    const result = likeProfile(id, type);
    if (result.matched) {
      setMatchedProfile({ id, name, photo });
      setMatchOpen(true);
    } else {
      showToast({
        title: type === "super_like" ? "Super liked!" : "Liked!",
        tone: "success",
      });
    }
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        <aside className={`${styles.filters} hide-mobile`} aria-label="Discover filters">
          <div className={styles.filtersHeader}>
            <SlidersHorizontal size={18} aria-hidden="true" />
            <h2 className={styles.filtersTitle}>Filters</h2>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="min-age">
              Age range: {minAge}&ndash;{maxAge}
            </label>
            <div className={styles.rangeRow}>
              <input
                id="min-age"
                type="range"
                min={18}
                max={maxAge}
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                aria-label="Minimum age"
              />
              <input
                id="max-age"
                type="range"
                min={minAge}
                max={80}
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                aria-label="Maximum age"
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="max-distance">
              Distance: within {maxDistance} mi
            </label>
            <input
              id="max-distance"
              type="range"
              min={1}
              max={200}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
            />
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Looking for</span>
            <div className={styles.chipRow}>
              {ALL_INTENTIONS.map((intention) => (
                <Chip
                  key={intention}
                  selected={intentions.includes(intention)}
                  onClick={() => toggleIntention(intention)}
                >
                  {INTENTION_LABELS[intention]}
                </Chip>
              ))}
            </div>
          </div>

          {upNext.length > 0 && (
            <div className={styles.queue}>
              <div className={styles.queueHeader}>
                <Sparkles size={16} aria-hidden="true" />
                <span>Up next</span>
              </div>
              <ul className={styles.queueList}>
                {upNext.map(({ profile }) => (
                  <li key={profile.id} className={styles.queueItem}>
                    <span className={styles.queueThumb}>
                      <Image
                        src={profile.photos[0]}
                        alt=""
                        fill
                        sizes="48px"
                      />
                    </span>
                    <span className={styles.queueName}>
                      {profile.firstName}, {profile.age}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <div className={styles.main}>
          {loading ? (
            <div className={styles.loading}>
              <Skeleton className={styles.skeletonCard} />
              <p className={styles.loadingText}>Rounding up some good folks&hellip;</p>
            </div>
          ) : current ? (
            <>
              <div className={`${styles.cardWrap} hide-mobile`}>
                <ProfileCard
                  profile={current.profile}
                  viewProfileHref={`/profile/${current.profile.id}`}
                  onPass={() => handlePass(current.profile.id)}
                  onLike={() =>
                    handleLike(
                      current.profile.id,
                      current.profile.firstName,
                      current.profile.photos[0],
                      "like",
                    )
                  }
                  onSuperLike={() =>
                    handleLike(
                      current.profile.id,
                      current.profile.firstName,
                      current.profile.photos[0],
                      "super_like",
                    )
                  }
                />
              </div>

              <div className={`${styles.mobileCard} hide-desktop`}>
                <div className={styles.mobilePhoto}>
                  <Image
                    src={current.profile.photos[0]}
                    alt={`${current.profile.firstName}'s primary photo`}
                    fill
                    sizes="100vw"
                    priority
                  />
                  <div className={styles.mobileScrim} aria-hidden="true" />
                  <a
                    href={`/profile/${current.profile.id}`}
                    className={styles.mobileViewProfile}
                  >
                    View Profile
                  </a>
                  <div className={styles.mobileInfo}>
                    <h1 className={styles.mobileName}>
                      {current.profile.firstName}, {current.profile.age}
                    </h1>
                    <p className={styles.mobileMeta}>
                      {current.profile.city}, {current.profile.state}
                      {typeof current.profile.distanceMiles === "number" &&
                        ` · ${current.profile.distanceMiles} mi`}
                    </p>
                    <p className={styles.mobileBio}>{current.profile.bio}</p>
                  </div>
                </div>
                <div className={styles.mobileActions}>
                  <PassButton size="lg" onClick={() => handlePass(current.profile.id)} />
                  <SuperLikeButton
                    onClick={() =>
                      handleLike(
                        current.profile.id,
                        current.profile.firstName,
                        current.profile.photos[0],
                        "super_like",
                      )
                    }
                  />
                  <LikeButton
                    size="lg"
                    onClick={() =>
                      handleLike(
                        current.profile.id,
                        current.profile.firstName,
                        current.profile.photos[0],
                        "like",
                      )
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <EmptyState
              title="Looks like we've reached the end of this dirt road."
              description="New folks join HillBilly Dating all the time — check back soon, or widen your filters to see more matches."
            />
          )}
        </div>
      </div>

      <MatchModal
        open={matchOpen}
        onClose={() => setMatchOpen(false)}
        yourPhoto={me.photos[0] ?? ""}
        theirPhoto={matchedProfile?.photo ?? ""}
        theirName={matchedProfile?.name ?? ""}
        messageHref={`/messages/${matchedProfile?.id ?? ""}`}
      />
    </div>
  );
}
