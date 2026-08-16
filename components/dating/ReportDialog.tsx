"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./ReportDialog.module.css";

const REASONS = [
  "Fake profile",
  "Inappropriate photos",
  "Harassment or abuse",
  "Spam or scam",
  "Underage user",
  "Other",
];

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  name: string;
}

export function ReportDialog({ open, onClose, onSubmit, name }: ReportDialogProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    onSubmit(reason, details);
    setReason("");
    setDetails("");
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Report ${name}`}
      description="Your report is confidential. Our team reviews every report."
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <Select
          label="Reason"
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="" disabled>
            Select a reason
          </option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <Textarea
          label="Additional details (optional)"
          placeholder="Tell us more about what happened…"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" disabled={!reason}>
            Submit Report
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
