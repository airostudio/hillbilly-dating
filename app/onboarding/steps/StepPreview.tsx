"use client";

import { ChevronLeft, PartyPopper } from "lucide-react";
import type { ProfileView } from "@/types";
import { ProfileCard } from "@/components/dating/ProfileCard";
import { PromptAnswer } from "@/components/dating/PromptAnswer";
import { Button } from "@/components/ui/Button";
import stepStyles from "./StepShell.module.css";
import styles from "./StepPreview.module.css";

interface StepPreviewProps {
  profile: ProfileView;
  onBack: () => void;
  onFinish: () => void;
  submitting?: boolean;
}

export function StepPreview({ profile, onBack, onFinish, submitting }: StepPreviewProps) {
  return (
    <div className={styles.wrap}>
      <p className={stepStyles.eyebrow}>Step 7 of 7</p>
      <h1 className={stepStyles.title}>Preview</h1>
      <p className={stepStyles.subtitle}>Here&apos;s how your profile will look to other folks.</p>

      <ProfileCard profile={profile} showActions={false} />

      {profile.prompts.length > 0 && (
        <div className={styles.promptList}>
          {profile.prompts.map((prompt) => (
            <PromptAnswer key={prompt.id} question={prompt.question} answer={prompt.answer} />
          ))}
        </div>
      )}

      <div className={styles.nav}>
        <Button type="button" variant="ghost" onClick={onBack} disabled={submitting}>
          <ChevronLeft size={18} aria-hidden="true" />
          Back
        </Button>
        <Button type="button" variant="primary" size="lg" onClick={onFinish} disabled={submitting}>
          <PartyPopper size={18} aria-hidden="true" />
          Start Meeting Folks
        </Button>
      </div>
    </div>
  );
}
