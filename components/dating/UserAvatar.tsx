import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import styles from "./UserAvatar.module.css";

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
  className?: string;
}

export function UserAvatar({ src, name, size = "md", online, className }: UserAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const px = { sm: 32, md: 44, lg: 64, xl: 96 }[size];

  return (
    <span className={cn(styles.wrap, styles[size], className)}>
      {src ? (
        <Image src={src} alt={`${name}'s photo`} width={px} height={px} className={styles.image} />
      ) : (
        <span className={styles.fallback} aria-hidden="true">
          {initial}
        </span>
      )}
      {online !== undefined && (
        <span
          className={cn(styles.status, online ? styles.online : styles.offline)}
          aria-label={online ? "Online now" : "Offline"}
        />
      )}
    </span>
  );
}
