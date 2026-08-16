"use client";

import { useState } from "react";
import { Heart, Lock } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/dating/EmptyState";
import { ProfileCard } from "@/components/dating/ProfileCard";
import { MatchModal } from "@/components/dating/MatchModal";
import { cn } from "@/lib/utils/cn";
import type { ProfileView } from "@/types";
import styles from "./LikesView.module.css";

// Premium gating is a placeholder — flip this to a real subscription check when
// billing ships. Everything downstream is already wired to react to it.
const isPremium = false;

// Keep the first few "Likes You" cards visible even for free users so the tab
// never reads as empty; blur roughly the rest.
function isCardBlurred(index: number) {
  if (isPremium) return false;
  return index >= 3 && index % 2 === 0;
}

export function LikesView() {
  const { likesYou, youLiked, likeProfile, passProfile, me } = useDemoStore();
  const [matchedProfile, setMatchedProfile] = useState<ProfileView | null>(null);

  function handleLike(profile: ProfileView) {
    const { matched } = likeProfile(profile.id);
    if (matched) setMatchedProfile(profile);
  }

  const likesYouContent =
    likesYou.length === 0 ? (
      <EmptyState
        icon={<Heart aria-hidden="true" size={32} />}
        title="No one's shown love yet — hang tight."
        description="Keep your profile fresh and folks will come knockin'."
        action={<Button href="/discover">Find Somebody</Button>}
      />
    ) : (
      <div className={styles.grid}>
        {likesYou.map((profile, index) => {
          const blurred = isCardBlurred(index);
          return (
            <div key={profile.id} className={styles.cardWrap}>
              <div className={cn(styles.cardInner, blurred && styles.blurred)}>
                <ProfileCard
                  profile={profile}
                  showActions={!blurred}
                  onPass={() => passProfile(profile.id)}
                  onLike={() => handleLike(profile)}
                  viewProfileHref={blurred ? undefined : `/profile/${profile.id}`}
                />
              </div>
              {blurred && (
                <div className={styles.lockOverlay}>
                  <Lock aria-hidden="true" size={24} />
                  <p className={styles.lockCopy}>Upgrade to see who likes you</p>
                  <Button size="sm" disabled className={styles.comingSoon}>
                    Coming soon
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

  const youLikedContent =
    youLiked.length === 0 ? (
      <EmptyState
        icon={<Heart aria-hidden="true" size={32} />}
        title="You haven't liked anyone yet."
        description="Head over to Discover and start showing some love."
        action={<Button href="/discover">Find Somebody</Button>}
      />
    ) : (
      <div className={styles.grid}>
        {youLiked.map((profile) => (
          <div key={profile.id} className={styles.cardWrap}>
            <ProfileCard profile={profile} showActions={false} viewProfileHref={`/profile/${profile.id}`} />
          </div>
        ))}
      </div>
    );

  return (
    <div className="container">
      <h1 className={styles.heading}>Likes</h1>
      <Tabs
        tabs={[
          {
            value: "likes-you",
            label: "Likes You",
            content: likesYouContent,
            badge: likesYou.length > 0 ? <Badge tone="rose">{likesYou.length}</Badge> : undefined,
          },
          {
            value: "you-liked",
            label: "You Liked",
            content: youLikedContent,
            badge: youLiked.length > 0 ? <Badge tone="neutral">{youLiked.length}</Badge> : undefined,
          },
        ]}
      />
      <MatchModal
        open={Boolean(matchedProfile)}
        onClose={() => setMatchedProfile(null)}
        yourPhoto={me.photos[0] ?? ""}
        theirPhoto={matchedProfile?.photos[0] ?? ""}
        theirName={matchedProfile?.firstName ?? ""}
        messageHref={matchedProfile ? `/messages/${matchedProfile.id}` : "/messages"}
      />
    </div>
  );
}
