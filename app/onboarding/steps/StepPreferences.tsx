"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input, Select } from "@/components/ui/Input";
import { onboardingPreferencesSchema } from "@/lib/validation/schemas";
import { INTERESTED_IN_LABELS } from "@/types";
import type { InterestedIn } from "@/types";
import { StepNav } from "./StepNav";
import styles from "./StepShell.module.css";

export type PreferencesValues = z.infer<typeof onboardingPreferencesSchema>;

interface StepPreferencesProps {
  defaultValues: Partial<PreferencesValues>;
  onNext: (values: PreferencesValues) => void;
  onBack: () => void;
}

export function StepPreferences({ defaultValues, onNext, onBack }: StepPreferencesProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PreferencesValues>({
    resolver: zodResolver(onboardingPreferencesSchema),
    mode: "onChange",
    defaultValues: {
      interestedIn: defaultValues.interestedIn ?? "everyone",
      minAge: defaultValues.minAge ?? 21,
      maxAge: defaultValues.maxAge ?? 45,
      maxDistance: defaultValues.maxDistance ?? 50,
    },
  });

  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Step 2 of 7</p>
      <h1 className={styles.title}>Who Are You Looking For?</h1>
      <p className={styles.subtitle}>
        We&apos;ll use this to round up the right folks for you first.
      </p>
      <form className={styles.form} onSubmit={handleSubmit(onNext)} noValidate>
        <Select
          label="Interested in"
          required
          error={errors.interestedIn?.message}
          {...register("interestedIn")}
        >
          {(Object.keys(INTERESTED_IN_LABELS) as InterestedIn[]).map((value) => (
            <option key={value} value={value}>
              {INTERESTED_IN_LABELS[value]}
            </option>
          ))}
        </Select>
        <div className={styles.fieldGrid}>
          <Input
            label="Minimum age"
            type="number"
            min={18}
            max={99}
            required
            error={errors.minAge?.message}
            {...register("minAge", { valueAsNumber: true })}
          />
          <Input
            label="Maximum age"
            type="number"
            min={18}
            max={99}
            required
            error={errors.maxAge?.message}
            {...register("maxAge", { valueAsNumber: true })}
          />
        </div>
        <Input
          label="Search radius (miles)"
          type="number"
          min={1}
          max={500}
          required
          hint="How far are you willing to look?"
          error={errors.maxDistance?.message}
          {...register("maxDistance", { valueAsNumber: true })}
        />
        <StepNav onBack={onBack} continueDisabled={!isValid} />
      </form>
    </div>
  );
}
