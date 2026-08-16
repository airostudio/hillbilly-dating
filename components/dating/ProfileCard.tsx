import Image from "next/image";
import type { ProfileView } from "@/types";
import { INTENTION_LABELS } from "@/types";
import { VerificationBadge } from "./VerificationBadge";
import { PassButton, LikeButton, SuperLikeButton } from "./ActionButtons";
import styles from "./ProfileCard.module.css";

interface ProfileCardProps {
  profile: ProfileView;
  onPass?: () => void;
  onLike?: () => void;
  onSuperLike?: () => void;
  showActions?: boolean;
  viewProfileHref?: string;
}

export function ProfileCard({
  profile,
  onPass,
  onLike,
  onSuperLike,
  showActions = true,
  viewProfileHref,
}: ProfileCardProps) {
  const prompt = profile.prompts[0];
  const primaryPhoto = profile.photos[0];

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.photo}>
          {primaryPhoto ? (
            <Image
              src={primaryPhoto}
              alt={`${profile.firstName}'s primary photo`}
              fill
              sizes="(max-width: 640px) 100vw, 420px"
              priority
            />
          ) : (
            <div className={styles.photoPlaceholder} aria-hidden="true">
              {profile.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.scrim} aria-hidden="true" />
        {viewProfileHref && (
          <a href={viewProfileHref} className={styles.viewProfileLink}>
            View Profile
          </a>
        )}
        <div className={styles.content}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{profile.firstName}</h3>
            <span className={styles.age}>{profile.age}</span>
            {profile.verified && (
              <span className={styles.verifiedRow}>
                <VerificationBadge compact />
              </span>
            )}
          </div>
          <div className={styles.metaRow}>
            <span>
              {profile.city}, {profile.state}
              {typeof profile.distanceMiles === "number" && ` · ${profile.distanceMiles} mi`}
            </span>
            <span>{INTENTION_LABELS[profile.relationshipIntention]}</span>
          </div>
          <p className={styles.bio}>{profile.bio}</p>
          <div className={styles.interests}>
            {profile.interests.slice(0, 4).map((interest) => (
              <span key={interest} className={styles.interestPill}>
                {interest}
              </span>
            ))}
          </div>
          {prompt && (
            <div className={styles.prompt}>
              <p className={styles.promptQuestion}>{prompt.question}</p>
              <p className={styles.promptAnswer}>{prompt.answer}</p>
            </div>
          )}
        </div>
      </div>
      {showActions && (
        <div className={styles.actions}>
          <PassButton onClick={onPass} size="lg" />
          <SuperLikeButton onClick={onSuperLike} />
          <LikeButton onClick={onLike} size="lg" />
        </div>
      )}
    </div>
  );
}
