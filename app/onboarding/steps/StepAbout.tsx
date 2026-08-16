"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Info } from "lucide-react";
import { Input, Select } from "@/components/ui/Input";
import { onboardingAboutSchema } from "@/lib/validation/schemas";
import { GENDER_LABELS } from "@/types";
import type { Gender } from "@/types";
import { StepNav } from "./StepNav";
import styles from "./StepShell.module.css";

export type AboutValues = z.infer<typeof onboardingAboutSchema>;

interface StepAboutProps {
  defaultValues: Partial<AboutValues>;
  onNext: (values: AboutValues) => void;
}

export function StepAbout({ defaultValues, onNext }: StepAboutProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AboutValues>({
    resolver: zodResolver(onboardingAboutSchema),
    mode: "onChange",
    defaultValues: {
      firstName: defaultValues.firstName ?? "",
      dateOfBirth: defaultValues.dateOfBirth ?? "",
      gender: defaultValues.gender ?? "woman",
      pronouns: defaultValues.pronouns ?? "",
      city: defaultValues.city ?? "",
      state: defaultValues.state ?? "",
    },
  });

  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Step 1 of 7</p>
      <h1 className={styles.title}>About You</h1>
      <p className={styles.subtitle}>
        Let&apos;s start with the basics so folks know who they&apos;re talking to.
      </p>
      <div className={styles.note}>
        <Info size={18} aria-hidden="true" />
        <span>You must be 18 or older to join HillBilly Dating.</span>
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onNext)} noValidate>
        <Input
          label="First name"
          required
          placeholder="Waylon"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Date of birth"
          type="date"
          required
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />
        <Select label="Gender" required error={errors.gender?.message} {...register("gender")}>
          {(Object.keys(GENDER_LABELS) as Gender[]).map((value) => (
            <option key={value} value={value}>
              {GENDER_LABELS[value]}
            </option>
          ))}
        </Select>
        <Input
          label="Pronouns"
          hint="Optional"
          placeholder="he/him, she/her, they/them…"
          error={errors.pronouns?.message}
          {...register("pronouns")}
        />
        <div className={styles.fieldGrid}>
          <Input
            label="City"
            required
            placeholder="Amarillo"
            error={errors.city?.message}
            {...register("city")}
          />
          <Input
            label="State"
            required
            placeholder="TX"
            error={errors.state?.message}
            {...register("state")}
          />
        </div>
        <StepNav continueDisabled={!isValid} />
      </form>
    </div>
  );
}
