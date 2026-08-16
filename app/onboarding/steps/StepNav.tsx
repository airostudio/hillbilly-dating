import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./StepShell.module.css";

interface StepNavProps {
  onBack?: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  submitting?: boolean;
}

export function StepNav({ onBack, continueDisabled, continueLabel = "Continue", submitting }: StepNavProps) {
  return (
    <div className={styles.nav}>
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          <ChevronLeft size={18} aria-hidden="true" />
          Back
        </Button>
      ) : (
        <span className={styles.navSpacer} aria-hidden="true" />
      )}
      <Button type="submit" variant="primary" disabled={continueDisabled || submitting}>
        {continueLabel}
        <ChevronRight size={18} aria-hidden="true" />
      </Button>
    </div>
  );
}
