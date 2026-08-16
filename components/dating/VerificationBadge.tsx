import { BadgeCheck } from "lucide-react";
import styles from "./VerificationBadge.module.css";

export function VerificationBadge({ compact }: { compact?: boolean }) {
  return (
    <span className={styles.badge} role="img" aria-label="Verified profile">
      <BadgeCheck size={compact ? 16 : 18} aria-hidden="true" />
      {!compact && <span>Verified</span>}
    </span>
  );
}
