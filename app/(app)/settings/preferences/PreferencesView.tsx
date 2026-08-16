"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useDemoStore } from "@/lib/demo-store";
import { useToast } from "@/components/ui/Toast";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { preferencesSchema } from "@/lib/validation/schemas";
import { LIFESTYLE_INTERESTS } from "@/lib/demo-data";
import { INTENTION_LABELS, INTERESTED_IN_LABELS } from "@/types";
import type { RelationshipIntention, InterestedIn } from "@/types";
import styles from "./PreferencesView.module.css";

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const INTENTIONS = Object.keys(INTENTION_LABELS) as RelationshipIntention[];
const INTERESTED_IN_OPTIONS = Object.keys(INTERESTED_IN_LABELS) as InterestedIn[];

export function PreferencesView() {
  const { preferences, updatePreferences } = useDemoStore();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    mode: "onChange",
    defaultValues: {
      interestedIn: preferences.interestedIn,
      minAge: preferences.minAge,
      maxAge: preferences.maxAge,
      maxDistance: preferences.maxDistance,
      intentions: preferences.intentions,
      dealbreakerInterests: preferences.dealbreakerInterests,
    },
  });

  const watched = watch();

  function toggleIntention(intention: RelationshipIntention) {
    const current = watched.intentions ?? [];
    const next = current.includes(intention)
      ? current.filter((i) => i !== intention)
      : [...current, intention];
    setValue("intentions", next, { shouldValidate: true, shouldDirty: true });
  }

  function toggleDealbreaker(interest: string) {
    const current = watched.dealbreakerInterests ?? [];
    const next = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : [...current, interest];
    setValue("dealbreakerInterests", next, { shouldValidate: true, shouldDirty: true });
  }

  const onSubmit = (values: PreferencesFormValues) => {
    updatePreferences(values);
    showToast({ title: "Preferences saved", tone: "success" });
  };

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Discovery Preferences</h1>
      <p className={styles.subtitle}>
        Tell us who you&apos;d like to see more of in Discover.
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card>
          <CardHeader>
            <h2 className={styles.cardTitle}>Who you&apos;d like to meet</h2>
          </CardHeader>
          <CardBody className={styles.cardBody}>
            <Select
              label="Interested in"
              required
              error={errors.interestedIn?.message}
              {...register("interestedIn")}
            >
              {INTERESTED_IN_OPTIONS.map((value) => (
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
              label="Maximum distance (miles)"
              type="number"
              min={1}
              max={500}
              required
              error={errors.maxDistance?.message}
              {...register("maxDistance", { valueAsNumber: true })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className={styles.cardTitle}>Relationship intentions</h2>
          </CardHeader>
          <CardBody className={styles.cardBody}>
            <p className={styles.hint}>
              Show me people looking for any of the following (leave blank to see everyone).
            </p>
            <div className={styles.chipGrid}>
              {INTENTIONS.map((intention) => (
                <Chip
                  key={intention}
                  selected={(watched.intentions ?? []).includes(intention)}
                  onClick={() => toggleIntention(intention)}
                >
                  {INTENTION_LABELS[intention]}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className={styles.cardTitle}>Dealbreakers</h2>
          </CardHeader>
          <CardBody className={styles.cardBody}>
            <p className={styles.hint}>
              Select lifestyle interests that matter most to you. Profiles that share these
              interests with you may show up more often in your Discover feed — this doesn&apos;t
              exclude anyone, it just helps us find your best matches.
            </p>
            <div className={styles.chipGrid}>
              {LIFESTYLE_INTERESTS.map((interest) => (
                <Chip
                  key={interest}
                  selected={(watched.dealbreakerInterests ?? []).includes(interest)}
                  onClick={() => toggleDealbreaker(interest)}
                >
                  {interest}
                </Chip>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className={styles.submitRow}>
          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  );
}
