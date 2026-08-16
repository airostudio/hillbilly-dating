"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import { LIFESTYLE_INTERESTS } from "@/lib/demo-data";
import { StepNav } from "./StepNav";
import stepStyles from "./StepShell.module.css";
import styles from "./StepInterests.module.css";

const MIN = 3;
const MAX = 10;

interface StepInterestsProps {
  defaultValue: string[];
  onNext: (interests: string[]) => void;
  onBack: () => void;
}

export function StepInterests({ defaultValue, onNext, onBack }: StepInterestsProps) {
  const [selected, setSelected] = useState<string[]>(defaultValue);

  const toggle = (interest: string) => {
    setSelected((prev) => {
      if (prev.includes(interest)) return prev.filter((i) => i !== interest);
      if (prev.length >= MAX) return prev;
      return [...prev, interest];
    });
  };

  const isValid = selected.length >= MIN && selected.length <= MAX;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isValid) onNext(selected);
  };

  return (
    <div className={stepStyles.wrap}>
      <p className={stepStyles.eyebrow}>Step 5 of 7</p>
      <h1 className={stepStyles.title}>Country Life</h1>
      <p className={stepStyles.subtitle}>Pick 3 to 10 things that sound like you.</p>
      <form className={stepStyles.form} onSubmit={handleSubmit} noValidate>
        <p className={styles.counter} data-met={isValid}>
          {selected.length} of {MAX} selected (minimum {MIN})
        </p>
        <div className={styles.grid} role="group" aria-label="Interests">
          {LIFESTYLE_INTERESTS.map((interest) => (
            <Chip
              key={interest}
              selected={selected.includes(interest)}
              onClick={() => toggle(interest)}
              disabled={!selected.includes(interest) && selected.length >= MAX}
            >
              {interest}
            </Chip>
          ))}
        </div>
        <StepNav onBack={onBack} continueDisabled={!isValid} />
      </form>
    </div>
  );
}
