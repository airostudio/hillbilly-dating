"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileView } from "@/types";
import { useDemoStore, YOU_PROFILE_ID } from "@/lib/demo-store";
import { StepAbout, type AboutValues } from "./steps/StepAbout";
import { StepPreferences, type PreferencesValues } from "./steps/StepPreferences";
import { StepPhotos } from "./steps/StepPhotos";
import { StepAboutYou, type AboutYouValues } from "./steps/StepAboutYou";
import { StepInterests } from "./steps/StepInterests";
import { StepPrompts, type PromptValue } from "./steps/StepPrompts";
import { StepPreview } from "./steps/StepPreview";
import styles from "./OnboardingWizard.module.css";

const TOTAL_STEPS = 7;
const STEP_TITLES = [
  "About You",
  "Preferences",
  "Photos",
  "Your Story",
  "Interests",
  "Prompts",
  "Preview",
];

interface WizardState {
  about: Partial<AboutValues>;
  preferences: Partial<PreferencesValues>;
  photos: string[];
  aboutYou: Partial<AboutYouValues>;
  interests: string[];
  prompts: PromptValue[];
}

function calcAge(dob: string): number {
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

export function OnboardingWizard() {
  const router = useRouter();
  const { completeOnboarding } = useDemoStore();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<WizardState>({
    about: {},
    preferences: {},
    photos: [],
    aboutYou: {},
    interests: [],
    prompts: [],
  });

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));

  const previewProfile = useMemo<ProfileView>(() => {
    const about = data.about;
    const aboutYou = data.aboutYou;
    return {
      id: YOU_PROFILE_ID,
      firstName: about.firstName ?? "",
      age: about.dateOfBirth ? calcAge(about.dateOfBirth) : 0,
      gender: about.gender ?? "other",
      pronouns: about.pronouns || undefined,
      bio: aboutYou.bio ?? "",
      occupation: aboutYou.occupation || undefined,
      heightCm: aboutYou.heightCm,
      city: about.city ?? "",
      state: about.state ?? "",
      relationshipIntention: aboutYou.relationshipIntention ?? "not_sure",
      verified: false,
      photos: data.photos,
      interests: data.interests,
      prompts: data.prompts.map((p, i) => ({ id: `p${i + 1}`, question: p.question, answer: p.answer })),
      profileComplete: true,
    };
  }, [data]);

  const handleFinish = () => {
    setSubmitting(true);
    completeOnboarding(previewProfile);
    router.push("/discover");
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <span className={styles.brand}>HillBilly Dating</span>
          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={TOTAL_STEPS}
            aria-label={`Onboarding progress: step ${step + 1} of ${TOTAL_STEPS}`}
          >
            <div
              className={styles.progressFill}
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <span className={styles.stepLabel}>
            Step {step + 1} of {TOTAL_STEPS} · {STEP_TITLES[step]}
          </span>
        </div>
      </div>

      <div className={`container ${styles.content}`}>
        {step === 0 && (
          <StepAbout
            defaultValues={data.about}
            onNext={(values) => {
              setData((prev) => ({ ...prev, about: values }));
              goNext();
            }}
          />
        )}
        {step === 1 && (
          <StepPreferences
            defaultValues={data.preferences}
            onBack={goBack}
            onNext={(values) => {
              setData((prev) => ({ ...prev, preferences: values }));
              goNext();
            }}
          />
        )}
        {step === 2 && (
          <StepPhotos
            defaultValue={data.photos}
            onBack={goBack}
            onNext={(photos) => {
              setData((prev) => ({ ...prev, photos }));
              goNext();
            }}
          />
        )}
        {step === 3 && (
          <StepAboutYou
            defaultValues={data.aboutYou}
            onBack={goBack}
            onNext={(values) => {
              setData((prev) => ({ ...prev, aboutYou: values }));
              goNext();
            }}
          />
        )}
        {step === 4 && (
          <StepInterests
            defaultValue={data.interests}
            onBack={goBack}
            onNext={(interests) => {
              setData((prev) => ({ ...prev, interests }));
              goNext();
            }}
          />
        )}
        {step === 5 && (
          <StepPrompts
            defaultValue={data.prompts}
            onBack={goBack}
            onNext={(prompts) => {
              setData((prev) => ({ ...prev, prompts }));
              goNext();
            }}
          />
        )}
        {step === 6 && (
          <StepPreview
            profile={previewProfile}
            onBack={goBack}
            onFinish={handleFinish}
            submitting={submitting}
          />
        )}
      </div>
    </div>
  );
}
