"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, Sparkles, Link2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StepNav } from "./StepNav";
import stepStyles from "./StepShell.module.css";
import styles from "./StepPhotos.module.css";

const MAX_PHOTOS = 6;
const ALLOWED_HOSTS = ["api.dicebear.com", "supabase.co"];

function buildAvatarUrl(seed: string): string {
  const params = new URLSearchParams({
    seed,
    backgroundType: "gradientLinear",
    backgroundColor: "f7f0df,d8a33d,c7653a,354f3b",
  });
  return `https://api.dicebear.com/9.x/personas/svg?${params.toString()}`;
}

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 9);
}

function isAllowedUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return ALLOWED_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

interface StepPhotosProps {
  defaultValue: string[];
  onNext: (photos: string[]) => void;
  onBack: () => void;
}

export function StepPhotos({ defaultValue, onNext, onBack }: StepPhotosProps) {
  const [photos, setPhotos] = useState<string[]>(defaultValue);
  const [seed, setSeed] = useState(randomSeed());
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const addPhoto = (url: string) => {
    if (photos.length >= MAX_PHOTOS) return;
    setPhotos((prev) => [...prev, url]);
  };

  const handleGenerate = () => {
    addPhoto(buildAvatarUrl(seed || randomSeed()));
    setSeed(randomSeed());
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (!isAllowedUrl(urlInput.trim())) {
      setUrlError("In demo mode, photo URLs must be from api.dicebear.com or a Supabase storage bucket.");
      return;
    }
    addPhoto(urlInput.trim());
    setUrlInput("");
    setUrlError(null);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    setPhotos((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveRight = (index: number) => {
    setPhotos((prev) => {
      if (index === prev.length - 1) return prev;
      const next = [...prev];
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
      return next;
    });
  };

  const isValid = photos.length >= 1;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isValid) onNext(photos);
  };

  return (
    <div className={stepStyles.wrap}>
      <p className={stepStyles.eyebrow}>Step 3 of 7</p>
      <h1 className={stepStyles.title}>Your Photos</h1>
      <p className={stepStyles.subtitle}>
        Add up to 6 photos. The first one is your primary photo — use the arrows to reorder.
      </p>

      <form className={stepStyles.form} onSubmit={handleSubmit} noValidate>
        <p className={styles.count}>{photos.length} of {MAX_PHOTOS} added</p>

        <div className={styles.grid}>
          {photos.map((photo, index) => (
            <div key={`${photo}-${index}`} className={styles.slot}>
              {index === 0 && <span className={styles.primaryBadge}>Primary</span>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={`Profile photo ${index + 1}`} />
              <div className={styles.slotActions}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => moveLeft(index)}
                  disabled={index === 0}
                  aria-label="Move photo earlier"
                >
                  <ChevronLeft size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => removePhoto(index)}
                  aria-label="Remove photo"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => moveRight(index)}
                  disabled={index === photos.length - 1}
                  aria-label="Move photo later"
                >
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <div className={`${styles.slot} ${styles.addSlot}`}>
              <Sparkles size={20} aria-hidden="true" />
              <span>Add below</span>
            </div>
          )}
        </div>

        <div className={styles.sourceGroup}>
          <div>
            <p className={stepStyles.eyebrow} style={{ marginBottom: 4 }}>
              Generate an avatar
            </p>
            <div className={styles.addRow}>
              <Input
                aria-label="Avatar seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Type any word for a unique look"
              />
              <Button type="button" variant="outline" onClick={handleGenerate} disabled={photos.length >= MAX_PHOTOS}>
                <Sparkles size={16} aria-hidden="true" />
                Generate
              </Button>
            </div>
          </div>
          <div>
            <p className={stepStyles.eyebrow} style={{ marginBottom: 4 }}>
              Or add a photo URL
            </p>
            <div className={styles.addRow}>
              <Input
                aria-label="Photo URL"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setUrlError(null);
                }}
                placeholder="https://…"
                error={urlError ?? undefined}
              />
              <Button type="button" variant="outline" onClick={handleAddUrl} disabled={photos.length >= MAX_PHOTOS}>
                <Link2 size={16} aria-hidden="true" />
                Add
              </Button>
            </div>
          </div>
        </div>

        {!isValid && <p className={stepStyles.errorText}>Add at least 1 photo to continue.</p>}

        <StepNav onBack={onBack} continueDisabled={!isValid} />
      </form>
    </div>
  );
}
