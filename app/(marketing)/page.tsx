import type { Metadata } from "next";
import Image from "next/image";
import {
  Sprout,
  Heart,
  MessagesSquare,
  UserPlus,
  ClipboardList,
  Users,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DEMO_PROFILES, DEMO_TESTIMONIALS, LANDING_CATEGORIES } from "@/lib/demo-data";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Find Your Forever Porch Partner",
  alternates: { canonical: "/" },
};

const FEATURES = [
  {
    icon: Sprout,
    title: "Real Country Folks",
    description: "Meet people who actually understand your lifestyle.",
  },
  {
    icon: Heart,
    title: "More Than a Pretty Picture",
    description: "Profiles built around interests, values, and the life you want.",
  },
  {
    icon: MessagesSquare,
    title: "Made for Real Connections",
    description: "Match, chat, and see where the dirt road takes you.",
  },
];

const STEPS = [
  { icon: UserPlus, title: "Make your profile" },
  { icon: ClipboardList, title: "Tell us what matters" },
  { icon: Users, title: "Meet your matches" },
  { icon: MessageCircle, title: "Start talking" },
];

const HERO_CARDS = DEMO_PROFILES.slice(0, 3);

export default function LandingPage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1>Find your forever porch partner.</h1>
            <p className={styles.heroSub}>
              Meet country-loving singles who&rsquo;d rather watch a sunset from the tailgate
              than swipe all night.
            </p>
            <div className={styles.heroActions}>
              <Button href="/signup" size="lg">
                Start Meeting Folks
              </Button>
              <Button href="#how-it-works" variant="outline" size="lg">
                See How It Works
              </Button>
            </div>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            {HERO_CARDS.map((profile, i) => (
              <div key={profile.id} className={styles.heroCard} style={{ zIndex: i }}>
                <Image
                  src={profile.photos[0]}
                  alt=""
                  width={260}
                  height={340}
                  className={styles.heroCardImage}
                />
                <div className={styles.heroCardLabel}>
                  <strong>{profile.firstName}</strong>, {profile.age}
                  <span>{profile.city}, {profile.state}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Dating feels better out here</h2>
          <div className={styles.featureGrid}>
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <Icon size={26} aria-hidden="true" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How it works</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className={styles.step}>
                  <div className={styles.stepNumber}>{i + 1}</div>
                  <div className={styles.stepIcon}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Built around country life</h2>
          <div className={styles.categoryGrid}>
            {LANDING_CATEGORIES.map((category) => (
              <span key={category} className={styles.categoryChip}>
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="stories" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Real folks, real matches</h2>
          <div className={styles.testimonialGrid}>
            {DEMO_TESTIMONIALS.map((t) => (
              <Card key={t.name} className={styles.testimonialCard}>
                <Image
                  src={t.photo}
                  alt=""
                  width={56}
                  height={56}
                  className={styles.testimonialPhoto}
                  aria-hidden="true"
                />
                <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                <p className={styles.testimonialName}>
                  {t.name} <span>&middot; {t.location}</span>
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`container ${styles.finalCtaInner}`}>
          <h2>There&rsquo;s somebody out there saving you a seat on the porch.</h2>
          <Button href="/signup" size="lg">
            Create My Profile
          </Button>
        </div>
      </section>
    </>
  );
}
