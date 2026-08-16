"use client";

import { X, Heart, Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import styles from "./ActionButtons.module.css";

interface ActionButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  size?: "md" | "lg";
  className?: string;
}

export function PassButton({ onClick, disabled, size = "md", className }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(styles.action, styles.pass, styles[size], className)}
      aria-label="Pass"
      title="Pass"
    >
      <X aria-hidden="true" size={size === "lg" ? 28 : 22} />
    </button>
  );
}

export function LikeButton({ onClick, disabled, size = "md", className }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(styles.action, styles.like, styles[size], className)}
      aria-label="Like"
      title="Like"
    >
      <Heart aria-hidden="true" size={size === "lg" ? 28 : 22} />
    </button>
  );
}

export function SuperLikeButton({ onClick, disabled, size = "md", className }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(styles.action, styles.superLike, styles[size], className)}
      aria-label="Super Like"
      title="Super Like"
    >
      <Star aria-hidden="true" size={size === "lg" ? 26 : 20} />
    </button>
  );
}
