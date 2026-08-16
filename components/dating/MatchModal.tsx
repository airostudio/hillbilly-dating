"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import styles from "./MatchModal.module.css";

interface MatchModalProps {
  open: boolean;
  onClose: () => void;
  yourPhoto: string;
  theirPhoto: string;
  theirName: string;
  messageHref: string;
}

export function MatchModal({
  open,
  onClose,
  yourPhoto,
  theirPhoto,
  theirName,
  messageHref,
}: MatchModalProps) {
  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="match-title">
      <div className={styles.panel}>
        <div className={styles.photos}>
          <span className={styles.photoWrap}>
            <Image src={yourPhoto} alt="You" width={140} height={140} className={styles.photo} />
          </span>
          <span className={styles.photoWrap} style={{ marginLeft: "-2.5rem" }}>
            <Image
              src={theirPhoto}
              alt={theirName}
              width={140}
              height={140}
              className={styles.photo}
            />
          </span>
        </div>
        <h2 id="match-title" className={styles.title}>
          Well butter my biscuit — it&rsquo;s a match!
        </h2>
        <p className={styles.subtitle}>
          You and {theirName} both swiped right. Time to say hey.
        </p>
        <div className={styles.actions}>
          <Button href={messageHref} size="lg" fullWidth>
            Send a Message
          </Button>
          <Button variant="outline" size="lg" fullWidth onClick={onClose}>
            Keep Browsing
          </Button>
        </div>
      </div>
    </div>
  );
}
