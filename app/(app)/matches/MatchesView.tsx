"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { HeartHandshake } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { UserAvatar } from "@/components/dating/UserAvatar";
import { EmptyState } from "@/components/dating/EmptyState";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import styles from "./MatchesView.module.css";

export function MatchesView() {
  const { matches, getConversation } = useDemoStore();

  return (
    <div className="container">
      <h1 className={styles.heading}>Matches</h1>
      {matches.length === 0 ? (
        <EmptyState
          icon={<HeartHandshake aria-hidden="true" size={32} />}
          title="No matches yet — your porch swing's still got room."
          description="Head over to Discover and find someone to sit a spell with."
          action={<Button href="/discover">Find Somebody</Button>}
        />
      ) : (
        <ul className={styles.grid}>
          {matches.map(({ matchId, profile, matchedAt }) => {
            const conversation = getConversation(matchId);
            const lastMsg = conversation[conversation.length - 1];
            const unread = Boolean(lastMsg && !lastMsg.isMe);

            return (
              <li key={matchId}>
                <Link href={`/messages/${matchId}`} className={styles.card}>
                  <div className={styles.avatarWrap}>
                    <UserAvatar src={profile.photos[0]} name={profile.firstName} size="xl" online={profile.online} />
                    {unread && <span className={styles.dot} aria-label="Unread message" />}
                  </div>
                  <div className={styles.body}>
                    <span className={styles.name}>{profile.firstName}</span>
                    <span className={styles.matchedAt}>
                      Matched {formatDistanceToNow(new Date(matchedAt), { addSuffix: true })}
                    </span>
                    <span className={cn(styles.preview, unread && styles.previewUnread)}>
                      {lastMsg ? (lastMsg.body ?? "Sent a photo") : "Say hello!"}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
