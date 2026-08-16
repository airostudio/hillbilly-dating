"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { onboardingAboutYouSchema } from "@/lib/validation/schemas";
import { INTENTION_LABELS } from "@/types";
import type { RelationshipIntention } from "@/types";
import { StepNav } from "./StepNav";
import styles from "./StepShell.module.css";

export type AboutYouValues = z.infer<typeof onboardingAboutYouSchema>;

interface StepAboutYouProps {
  defaultValues: Partial<AboutYouValues>;
  onNext: (values: AboutYouValues) => void;
  onBack: () => void;
}

const BIO_MAX = 500;

export function StepAboutYou({ defaultValues, onNext, onBack }: StepAboutYouProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<AboutYouValues>({
    resolver: zodResolver(onboardingAboutYouSchema),
    mode: "onChange",
    defaultValues: {
      bio: defaultValues.bio ?? "",
      occupation: defaultValues.occupation ?? "",
      heightCm: defaultValues.heightCm,
      relationshipIntention: defaultValues.relationshipIntention ?? "dating",
    },
  });

  const bioLength = watch("bio")?.length ?? 0;

  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Step 4 of 7</p>
      <h1 className={styles.title}>Tell Folks About Yourself</h1>
      <p className={styles.subtitle}>A good bio gets you a lot further than a good jawline.</p>
      <form className={styles.form} onSubmit={handleSubmit(onNext)} noValidate>
        <div>
          <Textarea
            label="Bio"
            required
            rows={5}
            maxLength={BIO_MAX}
            placeholder="Raised on a cattle ranch, still fixing fences by day…"
            hint="At least 20 characters."
            error={errors.bio?.message}
            {...register("bio")}
          />
          <p className={styles.charCount} data-over={bioLength > BIO_MAX}>
            {bioLength}/{BIO_MAX}
          </p>
        </div>
        <Input
          label="Occupation"
          hint="Optional"
          placeholder="Ranch Hand"
          error={errors.occupation?.message}
          {...register("occupation")}
        />
        <Input
          label="Height (cm)"
          type="number"
          min={120}
          max={230}
          hint="Optional — e.g. 5'10&quot; is about 178 cm."
          error={errors.heightCm?.message}
          {...register("heightCm", {
            setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
          })}
        />
        <Select
          label="Relationship intention"
          required
          error={errors.relationshipIntention?.message}
          {...register("relationshipIntention")}
        >
          {(Object.keys(INTENTION_LABELS) as RelationshipIntention[]).map((value) => (
            <option key={value} value={value}>
              {INTENTION_LABELS[value]}
            </option>
          ))}
        </Select>
        <StepNav onBack={onBack} continueDisabled={!isValid} />
      </form>
    </div>
  );
}
