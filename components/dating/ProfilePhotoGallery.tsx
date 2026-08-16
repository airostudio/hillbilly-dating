"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import styles from "./ProfilePhotoGallery.module.css";

interface ProfilePhotoGalleryProps {
  photos: string[];
  name: string;
}

export function ProfilePhotoGallery({ photos, name }: ProfilePhotoGalleryProps) {
  const [index, setIndex] = useState(0);
  const total = photos.length;

  function go(delta: number) {
    setIndex((prev) => (prev + delta + total) % total);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.main}>
        <Image
          key={index}
          src={photos[index]}
          alt={`${name}'s photo ${index + 1} of ${total}`}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className={styles.image}
          priority
        />
        {total > 1 && (
          <>
            <button
              type="button"
              className={cn(styles.nav, styles.navLeft)}
              onClick={() => go(-1)}
              aria-label="Previous photo"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className={cn(styles.nav, styles.navRight)}
              onClick={() => go(1)}
              aria-label="Next photo"
            >
              <ChevronRight aria-hidden="true" />
            </button>
            <div className={styles.dots}>
              {photos.map((photo, i) => (
                <button
                  key={photo + i}
                  type="button"
                  className={cn(styles.dot, i === index && styles.dotActive)}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {total > 1 && (
        <div className={styles.thumbs}>
          {photos.map((photo, i) => (
            <button
              key={photo + i}
              type="button"
              className={cn(styles.thumb, i === index && styles.thumbActive)}
              onClick={() => setIndex(i)}
              aria-label={`View photo ${i + 1}`}
            >
              <Image src={photo} alt="" width={64} height={64} className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
