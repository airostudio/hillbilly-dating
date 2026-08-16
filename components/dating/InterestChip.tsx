import { cn } from "@/lib/utils/cn";
import styles from "./InterestChip.module.css";

interface InterestChipProps {
  label: string;
  className?: string;
}

export function InterestChip({ label, className }: InterestChipProps) {
  return <span className={cn(styles.chip, className)}>{label}</span>;
}
