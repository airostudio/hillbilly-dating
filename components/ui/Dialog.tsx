"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import styles from "./Dialog.module.css";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  hideTitle?: boolean;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  hideTitle,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogEl = ref.current;
    if (!dialogEl) return;
    if (open && !dialogEl.open) {
      dialogEl.showModal();
    } else if (!open && dialogEl.open) {
      dialogEl.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn(styles.dialog, className)}
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className={styles.content}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close dialog">
          <X size={20} aria-hidden="true" />
        </button>
        <h2 id="dialog-title" className={cn(styles.title, hideTitle && "sr-only")}>
          {title}
        </h2>
        {description && (
          <p id="dialog-description" className={styles.description}>
            {description}
          </p>
        )}
        {children}
      </div>
    </dialog>
  );
}
