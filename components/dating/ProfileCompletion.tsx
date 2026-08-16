import styles from "./ProfileCompletion.module.css";

interface ProfileCompletionProps {
  percent: number;
}

export function ProfileCompletion({ percent }: ProfileCompletionProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div className={styles.wrap}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Profile completion</span>
        <span className={styles.value}>{clamped}%</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Profile completion"
      >
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
      {clamped < 100 && (
        <p className={styles.hint}>Finish your profile to show up in more people&rsquo;s Discover.</p>
      )}
    </div>
  );
}
