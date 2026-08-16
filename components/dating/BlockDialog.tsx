"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import styles from "./ReportDialog.module.css";

interface BlockDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
}

export function BlockDialog({ open, onClose, onConfirm, name }: BlockDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Block ${name}?`}
      description={`${name} won't be able to see your profile or message you, and you won't see them in Discover. You can undo this anytime from Settings.`}
    >
      <div className={styles.actions}>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Block {name}
        </Button>
      </div>
    </Dialog>
  );
}
