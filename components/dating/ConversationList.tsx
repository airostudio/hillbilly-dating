import Link from "next/link";
import { UserAvatar } from "./UserAvatar";
import { cn } from "@/lib/utils/cn";
import styles from "./ConversationList.module.css";

export interface ConversationListItem {
  matchId: string;
  name: string;
  photo?: string | null;
  online?: boolean;
  lastMessage?: string;
  lastMessageAt?: string;
  unread?: boolean;
}

interface ConversationListProps {
  items: ConversationListItem[];
  activeMatchId?: string;
}

export function ConversationList({ items, activeMatchId }: ConversationListProps) {
  return (
    <ul className={styles.list} aria-label="Conversations">
      {items.map((item) => (
        <li key={item.matchId}>
          <Link
            href={`/messages/${item.matchId}`}
            className={cn(styles.item, item.matchId === activeMatchId && styles.active)}
          >
            <UserAvatar src={item.photo} name={item.name} size="lg" online={item.online} />
            <span className={styles.body}>
              <span className={styles.topRow}>
                <span className={styles.name}>{item.name}</span>
                {item.lastMessageAt && <span className={styles.time}>{item.lastMessageAt}</span>}
              </span>
              <span className={cn(styles.preview, item.unread && styles.unreadPreview)}>
                {item.lastMessage ?? "Say hello!"}
              </span>
            </span>
            {item.unread && <span className={styles.dot} aria-label="Unread message" />}
          </Link>
        </li>
      ))}
    </ul>
  );
}
