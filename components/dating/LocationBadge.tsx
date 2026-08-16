import { MapPin } from "lucide-react";
import styles from "./LocationBadge.module.css";

interface LocationBadgeProps {
  city: string;
  state: string;
  distanceMiles?: number;
}

export function LocationBadge({ city, state, distanceMiles }: LocationBadgeProps) {
  return (
    <span className={styles.badge}>
      <MapPin size={14} aria-hidden="true" />
      <span>
        {city}, {state}
        {typeof distanceMiles === "number" && ` · ${distanceMiles} mi away`}
      </span>
    </span>
  );
}
