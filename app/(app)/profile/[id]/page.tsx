import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDemoProfileById } from "@/lib/demo-data";
import { INTENTION_LABELS } from "@/types";
import { ProfilePhotoGallery } from "@/components/dating/ProfilePhotoGallery";
import { InterestChip } from "@/components/dating/InterestChip";
import { PromptAnswer } from "@/components/dating/PromptAnswer";
import { VerificationBadge } from "@/components/dating/VerificationBadge";
import { LocationBadge } from "@/components/dating/LocationBadge";
import { ProfileActions } from "./ProfileActions";
import styles from "./ProfileDetail.module.css";

export async function generateMetadata(
  props: PageProps<"/profile/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const profile = getDemoProfileById(id);
  return {
    title: profile ? `${profile.firstName}, ${profile.age} — HillBilly Dating` : "Profile",
  };
}

export default async function ProfileDetailPage(props: PageProps<"/profile/[id]">) {
  const { id } = await props.params;
  const profile = getDemoProfileById(id);

  if (!profile) {
    notFound();
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        <div className={styles.gallery}>
          <ProfilePhotoGallery photos={profile.photos} name={profile.firstName} />
        </div>

        <div className={styles.info}>
          <header className={styles.header}>
            <div className={styles.nameRow}>
              <h1 className={styles.name}>
                {profile.firstName}, {profile.age}
              </h1>
              {profile.verified && <VerificationBadge />}
            </div>
            <div className={styles.badgeRow}>
              <LocationBadge
                city={profile.city}
                state={profile.state}
                distanceMiles={profile.distanceMiles}
              />
              <span className={styles.intention}>
                {INTENTION_LABELS[profile.relationshipIntention]}
              </span>
            </div>
            {profile.occupation && (
              <p className={styles.occupation}>{profile.occupation}</p>
            )}
          </header>

          {profile.bio && (
            <section aria-labelledby="about-heading" className={styles.section}>
              <h2 id="about-heading" className={styles.sectionTitle}>
                About
              </h2>
              <p className={styles.bio}>{profile.bio}</p>
            </section>
          )}

          {profile.interests.length > 0 && (
            <section aria-labelledby="interests-heading" className={styles.section}>
              <h2 id="interests-heading" className={styles.sectionTitle}>
                Interests
              </h2>
              <div className={styles.interests}>
                {profile.interests.map((interest) => (
                  <InterestChip key={interest} label={interest} />
                ))}
              </div>
            </section>
          )}

          {profile.prompts.length > 0 && (
            <section aria-labelledby="prompts-heading" className={styles.section}>
              <h2 id="prompts-heading" className={styles.sectionTitle}>
                {profile.firstName}&rsquo;s Prompts
              </h2>
              <div className={styles.prompts}>
                {profile.prompts.map((prompt) => (
                  <PromptAnswer
                    key={prompt.id}
                    question={prompt.question}
                    answer={prompt.answer}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ProfileActions profile={profile} />
    </div>
  );
}
