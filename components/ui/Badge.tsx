import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Badge.module.css";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "forest" | "mustard" | "rose" | "orange" | "neutral";
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return <span className={cn(styles.badge, styles[tone], className)} {...props} />;
}
