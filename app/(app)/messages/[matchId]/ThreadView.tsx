"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, MoreVertical, SendHorizontal } from "lucide-react";
import { useDemoStore } from "@/lib/demo-store";
import { getDemoProfileById } from "@/lib/demo-data";
import { UserAvatar } from "@/components/dating/UserAvatar";
import { MessageBubble } from "@/components/dating/MessageBubble";
import { BlockDialog } from "@/components/dating/BlockDialog";
import { ReportDialog } from "@/components/dating/ReportDialog";
import { useToast } from "@/components/ui/Toast";
import { messageSchema } from "@/lib/validation/schemas";
import styles from "./ThreadView.module.css";

interface ThreadViewProps {
  matchId: string;
}

export function ThreadView({ matchId }: ThreadViewProps) {
  const { getConversation, sendMessage } = useDemoStore();
  const { showToast } = useToast();
  const profile = getDemoProfileById(matchId);
  const messages = getConversation(matchId);

  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  if (!profile) return null;

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const result = messageSchema.safeParse({ body: draft.trim() });
    if (!result.success) return;
    sendMessage(matchId, result.data.body);
    setDraft("");
    inputRef.current?.focus();
  }

  return (
    <div className={styles.thread}>
      <header className={styles.header}>
        <Link href="/messages" className={styles.back} aria-label="Back to messages">
          <ArrowLeft aria-hidden="true" size={20} />
        </Link>
        <UserAvatar src={profile.photos[0]} name={profile.firstName} size="md" online={profile.online} />
        <div className={styles.headerInfo}>
          <span className={styles.headerName}>{profile.firstName}</span>
          <span className={styles.headerStatus}>{profile.online ? "Online now" : "Active recently"}</span>
        </div>
        <Link href={`/profile/${matchId}`} className={styles.viewProfile}>
          View Profile
        </Link>
        <div className={styles.menuWrap}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label="More options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreVertical aria-hidden="true" size={20} />
          </button>
          {menuOpen && (
            <div role="menu" className={styles.menu}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setReportOpen(true);
                }}
              >
                Report {profile.firstName}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setBlockOpen(true);
                }}
              >
                Block {profile.firstName}
              </button>
            </div>
          )}
        </div>
      </header>

      <div className={styles.messages} ref={listRef}>
        {messages.length === 0 ? (
          <p className={styles.greeting}>You matched with {profile.firstName}! Say hi 👋</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              body={msg.body}
              imageUrl={msg.imageUrl}
              timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              isMe={msg.isMe}
              read={msg.isMe}
            />
          ))
        )}
      </div>

      <form className={styles.composer} onSubmit={handleSend}>
        <label htmlFor="message-input" className="sr-only">
          Message {profile.firstName}
        </label>
        <button
          type="button"
          className={styles.attachButton}
          title="Coming soon"
          aria-label="Attach an image (coming soon)"
          disabled
        >
          <ImagePlus aria-hidden="true" size={20} />
        </button>
        <input
          id="message-input"
          ref={inputRef}
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${profile.firstName}…`}
          autoComplete="off"
        />
        <button type="submit" className={styles.sendButton} disabled={!draft.trim()} aria-label="Send message">
          <SendHorizontal aria-hidden="true" size={18} />
        </button>
      </form>

      <BlockDialog
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        name={profile.firstName}
        onConfirm={() => {
          setBlockOpen(false);
          showToast({
            title: `${profile.firstName} blocked`,
            description: "You won't see them again in Discover or Messages.",
            tone: "success",
          });
        }}
      />
      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        name={profile.firstName}
        onSubmit={() => {
          setReportOpen(false);
          showToast({
            title: "Report submitted",
            description: "Thanks — our team will take a look.",
            tone: "success",
          });
        }}
      />
    </div>
  );
}
