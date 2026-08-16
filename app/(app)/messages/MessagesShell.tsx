"use client";

import type { ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { ConversationList } from "@/components/dating/ConversationList";
import { EmptyState } from "@/components/dating/EmptyState";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import styles from "./MessagesShell.module.css";

interface MessagesShellProps {
  activeMatchId?: string;
  children?: ReactNode;
}

/**
 * Shared two-column layout for /messages and /messages/[matchId]. Kept
 * self-contained in this folder (rather than a route-group layout.tsx) so it
 * can't collide with other agents' route files.
 */
export function MessagesShell({ activeMatchId, children }: MessagesShellProps) {
  const { matches, getConversation } = useDemoStore();

  const items = matches
    .map(({ matchId, profile, matchedAt }) => {
      const conversation = getConversation(matchId);
      const last = conversation[conversation.length - 1];
      return {
        matchId,
        name: profile.firstName,
        photo: profile.photos[0],
        online: profile.online,
        lastMessage: last?.body,
        lastMessageAt: last
          ? new Date(last.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : undefined,
        unread: Boolean(last && !last.isMe),
        sortKey: last ? new Date(last.createdAt).getTime() : new Date(matchedAt).getTime(),
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey);

  return (
    <div className={styles.shell}>
      <section
        className={cn(styles.listPane, Boolean(activeMatchId) && styles.hiddenMobile)}
        aria-label="Conversation list"
      >
        <h1 className={styles.heading}>Messages</h1>
        {items.length === 0 ? (
          <div className={styles.emptyWrap}>
            <EmptyState
              icon={<MessageCircle aria-hidden="true" size={32} />}
              title="No conversations yet"
              description="Match with somebody first, then the chattin' can start."
              action={<Button href="/discover">Find Somebody</Button>}
            />
          </div>
        ) : (
          <ConversationList items={items} activeMatchId={activeMatchId} />
        )}
      </section>
      <section
        className={cn(styles.threadPane, !activeMatchId && styles.hiddenMobile)}
        aria-label="Conversation"
      >
        {children ?? (
          <div className={styles.placeholder}>
            <MessageCircle aria-hidden="true" size={40} />
            <p>Pick a conversation to start chatting.</p>
          </div>
        )}
      </section>
    </div>
  );
}
