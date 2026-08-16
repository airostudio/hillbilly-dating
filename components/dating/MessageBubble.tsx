import Image from "next/image";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import styles from "./MessageBubble.module.css";

interface MessageBubbleProps {
  body?: string;
  imageUrl?: string;
  timestamp: string;
  isMe: boolean;
  read?: boolean;
}

export function MessageBubble({ body, imageUrl, timestamp, isMe, read }: MessageBubbleProps) {
  return (
    <div className={cn(styles.row, isMe && styles.rowMe)}>
      <div className={cn(styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem)}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Shared attachment"
            width={220}
            height={220}
            className={styles.image}
          />
        )}
        {body && <p className={styles.text}>{body}</p>}
        <span className={styles.meta}>
          {timestamp}
          {isMe && (
            <span className={styles.receipt} aria-label={read ? "Read" : "Sent"}>
              {read ? <CheckCheck size={14} /> : <Check size={14} />}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
