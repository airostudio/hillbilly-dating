import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./Chip.module.css";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: React.ReactNode;
}

export function Chip({ selected, icon, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(styles.chip, selected && styles.selected, className)}
      aria-pressed={selected}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
