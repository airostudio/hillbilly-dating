"use client";

import { useMemo, useState } from "react";
import { Pencil, Images, SlidersHorizontal, Settings, Eye, EyeOff } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import type { ProfileView as ProfileViewType } from "@/types";
import { Button } from "@/components/ui/Button";
import { ProfilePhotoGallery } from "@/components/dating/ProfilePhotoGallery";
import { PromptAnswer } from "@/components/dating/PromptAnswer";
import { InterestChip } from "@/components/dating/InterestChip";
import { VerificationBadge } from "@/components/dating/VerificationBadge";
import { LocationBadge } from "@/components/dating/LocationBadge";
import { ProfileCompletion } from "@/components/dating/ProfileCompletion";
import { ProfileCard } from "@/components/dating/ProfileCard";
import { INTENTION_LABELS } from "@/types";
import styles from "./MyProfileView.module.css";

const FALLBACK_PHOTO =
  "https://api.dicebear.com/9.x/personas/svg?seed=hillbilly-fallback&backgroundType=gradientLinear";

function computeCompletion(me: ProfileViewType): number {
  const checks = [
    me.photos.length > 0,
    me.bio.trim().length >= 20,
    Boolean(me.occupation && me.occupation.trim().length > 0),
    typeof me.heightCm === "number",
    Boolean(me.relationshipIntention),
    me.interests.length >= 3,
    me.prompts.length === 3,
  ];
  const filled = checks.filter(Boolean).length;
  return (filled / checks.length) * 100;
}

export function MyProfileView() {
  const { me } = useDemoStore();
  const [showPreview, setShowPreview] = useState(false);

  const percent = useMemo(() => computeCompletion(me), [me]);
  const photos = me.photos.length > 0 ? me.photos : [FALLBACK_PHOTO];

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Profile</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview((v) => !v)}
          aria-pressed={showPreview}
        >
          {showPreview ? (
            <>
              <EyeOff size={16} aria-hidden="true" /> Hide Preview
            </>
          ) : (
            <>
              <Eye size={16} aria-hidden="true" /> Preview Profile
            </>
          )}
        </Button>
      </div>

      <ProfileCompletion percent={percent} />

      <div className={styles.layout}>
        <div className={styles.main}>
          <ProfilePhotoGallery photos={photos} name={me.firstName} />

          <div className={styles.identity}>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>
                {me.firstName || "Add your name"}
                {me.age ? `, ${me.age}` : ""}
              </h2>
              {me.verified && <VerificationBadge compact />}
            </div>
            <LocationBadge city={me.city} state={me.state} />
            <p className={styles.intention}>{INTENTION_LABELS[me.relationshipIntention]}</p>
          </div>

          {me.bio && <p className={styles.bio}>{me.bio}</p>}

          {me.interests.length > 0 && (
            <div className={styles.interests}>
              {me.interests.map((interest) => (
                <InterestChip key={interest} label={interest} />
              ))}
            </div>
          )}

          {me.prompts.length > 0 && (
            <div className={styles.prompts}>
              {me.prompts.map((prompt) => (
                <PromptAnswer key={prompt.id} question={prompt.question} answer={prompt.answer} />
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <Button href="/profile/edit" variant="primary">
              <Pencil size={16} aria-hidden="true" /> Edit Profile
            </Button>
            <Button href="/profile/edit#photos" variant="outline">
              <Images size={16} aria-hidden="true" /> Manage Photos
            </Button>
            <Button href="/settings/preferences" variant="outline">
              <SlidersHorizontal size={16} aria-hidden="true" /> Preferences
            </Button>
            <Button href="/settings" variant="outline">
              <Settings size={16} aria-hidden="true" /> Account Settings
            </Button>
          </div>
        </div>

        {showPreview && (
          <aside className={styles.previewPane} aria-label="How others see your profile">
            <p className={styles.previewLabel}>This is how your card looks in Discover</p>
            <ProfileCard profile={{ ...me, photos }} showActions={false} />
          </aside>
        )}
      </div>
    </div>
  );
}
