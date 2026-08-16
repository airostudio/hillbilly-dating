"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import Image from "next/image";
import { ArrowUp, ArrowDown, Star, Trash2, Plus, Shuffle } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Chip } from "@/components/ui/Chip";
import { ProfileCard } from "@/components/dating/ProfileCard";
import { profileEditSchema } from "@/lib/validation/schemas";
import { LIFESTYLE_INTERESTS, PROMPT_QUESTIONS } from "@/lib/demo-data";
import { INTENTION_LABELS } from "@/types";
import type { RelationshipIntention, PromptAnswerView } from "@/types";
import styles from "./EditProfileView.module.css";

type EditFormValues = z.infer<typeof profileEditSchema>;

const INTENTIONS = Object.keys(INTENTION_LABELS) as RelationshipIntention[];

function makeAvatarUrl(seed: string): string {
  const params = new URLSearchParams({
    seed,
    backgroundType: "gradientLinear",
    backgroundColor: "f7f0df,d8a33d,c7653a,354f3b",
  });
  return `https://api.dicebear.com/9.x/personas/svg?${params.toString()}`;
}

function emptyPrompt(question: string, index: number): PromptAnswerView {
  return { id: `p${index}-${Date.now()}`, question, answer: "" };
}

export function EditProfileView() {
  const { me, updateMe } = useDemoStore();
  const { showToast } = useToast();
  const router = useRouter();

  const [photos, setPhotos] = useState<string[]>(me.photos);
  const [photoUrlDraft, setPhotoUrlDraft] = useState("");
  const [photosError, setPhotosError] = useState<string | null>(null);

  const [prompts, setPrompts] = useState<PromptAnswerView[]>(() => {
    if (me.prompts.length === 3) return me.prompts;
    const chosen = new Set(me.prompts.map((p) => p.question));
    const fillers = PROMPT_QUESTIONS.filter((q) => !chosen.has(q));
    const result = [...me.prompts];
    let fillerIndex = 0;
    while (result.length < 3 && fillerIndex < fillers.length) {
      result.push(emptyPrompt(fillers[fillerIndex], result.length));
      fillerIndex += 1;
    }
    return result;
  });
  const [promptErrors, setPromptErrors] = useState<Record<number, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    resolver: zodResolver(profileEditSchema),
    mode: "onChange",
    defaultValues: {
      bio: me.bio,
      occupation: me.occupation ?? "",
      heightCm: me.heightCm ?? undefined,
      city: me.city,
      state: me.state,
      relationshipIntention: me.relationshipIntention,
      interests: me.interests,
    },
  });

  const watched = watch();

  const previewProfile = useMemo(
    () => ({
      ...me,
      bio: watched.bio ?? me.bio,
      occupation: watched.occupation,
      heightCm: watched.heightCm,
      city: watched.city ?? me.city,
      state: watched.state ?? me.state,
      relationshipIntention: watched.relationshipIntention ?? me.relationshipIntention,
      interests: watched.interests ?? me.interests,
      photos: photos.length > 0 ? photos : me.photos,
      prompts,
    }),
    [me, watched, photos, prompts],
  );

  function toggleInterest(interest: string) {
    const current = watched.interests ?? [];
    const next = current.includes(interest)
      ? current.filter((i) => i !== interest)
      : current.length >= 10
        ? current
        : [...current, interest];
    setValue("interests", next, { shouldValidate: true, shouldDirty: true });
  }

  function addPhotoUrl() {
    const url = photoUrlDraft.trim();
    if (!url) return;
    setPhotos((prev) => [...prev, url]);
    setPhotoUrlDraft("");
    setPhotosError(null);
  }

  function addGeneratedAvatar() {
    setPhotos((prev) => [...prev, makeAvatarUrl(`${me.id}-${prev.length}-${Date.now()}`)]);
    setPhotosError(null);
  }

  function removePhoto(index: number) {
    setPhotos((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setPhotosError("Add at least one photo.");
      return next;
    });
  }

  function movePhoto(index: number, delta: number) {
    setPhotos((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function makePrimary(index: number) {
    setPhotos((prev) => {
      if (index === 0) return prev;
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  }

  function updatePromptQuestion(index: number, question: string) {
    setPrompts((prev) => prev.map((p, i) => (i === index ? { ...p, question } : p)));
  }

  function updatePromptAnswer(index: number, answer: string) {
    setPrompts((prev) => prev.map((p, i) => (i === index ? { ...p, answer } : p)));
  }

  function validatePhotosAndPrompts(): boolean {
    let ok = true;
    if (photos.length === 0) {
      setPhotosError("Add at least one photo.");
      ok = false;
    } else {
      setPhotosError(null);
    }

    const nextPromptErrors: Record<number, string> = {};
    prompts.forEach((p, i) => {
      if (!p.answer.trim()) {
        nextPromptErrors[i] = "Answer required";
      } else if (p.answer.length > 300) {
        nextPromptErrors[i] = "Keep it under 300 characters";
      }
    });
    setPromptErrors(nextPromptErrors);
    if (Object.keys(nextPromptErrors).length > 0) ok = false;

    return ok;
  }

  const onSubmit = (values: EditFormValues) => {
    if (!validatePhotosAndPrompts()) {
      showToast({
        title: "A few things need attention",
        description: "Check your photos and prompt answers.",
        tone: "error",
      });
      return;
    }

    updateMe({
      ...values,
      photos,
      prompts,
      profileComplete: true,
    });
    showToast({ title: "Profile updated", tone: "success" });
    router.push("/profile");
  };

  const usedQuestions = new Set(prompts.map((p) => p.question));

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Edit Profile</h1>

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <section className={styles.section} id="photos">
            <h2 className={styles.sectionTitle}>Photos</h2>
            <p className={styles.sectionHint}>
              Add at least one photo. Your first photo is your main profile picture.
            </p>
            <ul className={styles.photoList}>
              {photos.map((photo, index) => (
                <li key={photo + index} className={styles.photoItem}>
                  <div className={styles.photoThumb}>
                    <Image src={photo} alt="" fill sizes="72px" />
                  </div>
                  <div className={styles.photoMeta}>
                    <span className={styles.photoLabel}>
                      {index === 0 ? "Primary photo" : `Photo ${index + 1}`}
                    </span>
                  </div>
                  <div className={styles.photoActions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => movePhoto(index, -1)}
                      disabled={index === 0}
                      aria-label="Move photo earlier"
                    >
                      <ArrowUp size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => movePhoto(index, 1)}
                      disabled={index === photos.length - 1}
                      aria-label="Move photo later"
                    >
                      <ArrowDown size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => makePrimary(index)}
                      disabled={index === 0}
                      aria-label="Set as primary photo"
                      title="Set as primary"
                    >
                      <Star size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => removePhoto(index)}
                      disabled={photos.length === 1}
                      aria-label="Remove photo"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {photosError && (
              <p className={styles.fieldError} role="alert">
                {photosError}
              </p>
            )}
            <div className={styles.addPhotoRow}>
              <Input
                label="Add photo by URL"
                placeholder="https://…"
                value={photoUrlDraft}
                onChange={(e) => setPhotoUrlDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPhotoUrl();
                  }
                }}
              />
              <div className={styles.addPhotoButtons}>
                <Button type="button" variant="outline" size="sm" onClick={addPhotoUrl}>
                  <Plus size={16} aria-hidden="true" /> Add URL
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addGeneratedAvatar}>
                  <Shuffle size={16} aria-hidden="true" /> Generate avatar
                </Button>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>About</h2>
            <Textarea
              label="Bio"
              required
              rows={5}
              hint="At least 20 characters."
              error={errors.bio?.message}
              {...register("bio")}
            />
            <div className={styles.fieldGrid}>
              <Input
                label="Occupation"
                hint="Optional"
                error={errors.occupation?.message}
                {...register("occupation")}
              />
              <Input
                label="Height (cm)"
                type="number"
                min={120}
                max={230}
                hint="Optional"
                error={errors.heightCm?.message}
                {...register("heightCm", {
                  setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
                })}
              />
            </div>
            <div className={styles.fieldGrid}>
              <Input
                label="City"
                required
                error={errors.city?.message}
                {...register("city")}
              />
              <Input
                label="State"
                required
                error={errors.state?.message}
                {...register("state")}
              />
            </div>
            <Select
              label="Relationship intention"
              required
              error={errors.relationshipIntention?.message}
              {...register("relationshipIntention")}
            >
              {INTENTIONS.map((value) => (
                <option key={value} value={value}>
                  {INTENTION_LABELS[value]}
                </option>
              ))}
            </Select>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Interests</h2>
            <p className={styles.sectionHint}>Pick 3 to 10 that describe you.</p>
            <div className={styles.chipGrid}>
              {LIFESTYLE_INTERESTS.map((interest) => (
                <Chip
                  key={interest}
                  selected={(watched.interests ?? []).includes(interest)}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Chip>
              ))}
            </div>
            {errors.interests?.message && (
              <p className={styles.fieldError} role="alert">
                {errors.interests.message}
              </p>
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Prompts</h2>
            <p className={styles.sectionHint}>Answer all 3 prompts.</p>
            {prompts.map((prompt, index) => (
              <div key={index} className={styles.promptRow}>
                <Select
                  label={`Prompt ${index + 1}`}
                  value={prompt.question}
                  onChange={(e) => updatePromptQuestion(index, e.target.value)}
                >
                  {PROMPT_QUESTIONS.filter(
                    (q) => q === prompt.question || !usedQuestions.has(q),
                  ).map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </Select>
                <Textarea
                  label="Your answer"
                  rows={3}
                  value={prompt.answer}
                  onChange={(e) => updatePromptAnswer(index, e.target.value)}
                  error={promptErrors[index]}
                />
              </div>
            ))}
          </section>

          <div className={styles.submitRow}>
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Profile"}
            </Button>
            <Button type="button" variant="ghost" size="lg" onClick={() => router.push("/profile")}>
              Cancel
            </Button>
          </div>
        </form>

        <aside className={styles.previewPane} aria-label="Live profile preview">
          <p className={styles.previewLabel}>Live preview</p>
          <ProfileCard profile={previewProfile} showActions={false} />
        </aside>
      </div>
    </div>
  );
}
