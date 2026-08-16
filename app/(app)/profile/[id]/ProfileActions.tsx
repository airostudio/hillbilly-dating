"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, ShieldOff } from "lucide-react";
import type { ProfileView } from "@/types";
import { useDemoStore } from "@/lib/demo-store";
import { Button } from "@/components/ui/Button";
import { PassButton, LikeButton, SuperLikeButton } from "@/components/dating/ActionButtons";
import { MatchModal } from "@/components/dating/MatchModal";
import { ReportDialog } from "@/components/dating/ReportDialog";
import { BlockDialog } from "@/components/dating/BlockDialog";
import { useToast } from "@/components/ui/Toast";
import styles from "./ProfileActions.module.css";

interface ProfileActionsProps {
  profile: ProfileView;
}

export function ProfileActions({ profile }: ProfileActionsProps) {
  const router = useRouter();
  const { me, matches, likeProfile, passProfile } = useDemoStore();
  const { showToast } = useToast();

  const [matchOpen, setMatchOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [passed, setPassed] = useState(false);

  const isMatched = matches.some((m) => m.matchId === profile.id);

  function handlePass() {
    passProfile(profile.id);
    setPassed(true);
    router.push("/discover");
  }

  function handleLike(type: "like" | "super_like") {
    const result = likeProfile(profile.id, type);
    if (result.matched) {
      setMatchOpen(true);
    } else {
      showToast({
        title: type === "super_like" ? "Super liked!" : "Liked!",
        tone: "success",
      });
    }
  }

  function handleReport(reason: string, details: string) {
    void reason;
    void details;
    setReportOpen(false);
    showToast({
      title: "Report submitted — thanks for keeping HillBilly Dating safe.",
      tone: "success",
    });
  }

  function handleBlock() {
    setBlockOpen(false);
    showToast({ title: "Blocked.", tone: "info" });
    router.push("/discover");
  }

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.barInner}>
          <div className={styles.moreActions}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReportOpen(true)}
            >
              <Flag size={16} aria-hidden="true" /> Report
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBlockOpen(true)}
            >
              <ShieldOff size={16} aria-hidden="true" /> Block
            </Button>
          </div>

          <div className={styles.primaryActions}>
            {isMatched ? (
              <Button href={`/messages/${profile.id}`} size="lg" fullWidth>
                Message {profile.firstName}
              </Button>
            ) : (
              <>
                <PassButton size="lg" onClick={handlePass} disabled={passed} />
                <SuperLikeButton onClick={() => handleLike("super_like")} />
                <LikeButton size="lg" onClick={() => handleLike("like")} />
              </>
            )}
          </div>
        </div>
      </div>

      <MatchModal
        open={matchOpen}
        onClose={() => setMatchOpen(false)}
        yourPhoto={me.photos[0] ?? ""}
        theirPhoto={profile.photos[0] ?? ""}
        theirName={profile.firstName}
        messageHref={`/messages/${profile.id}`}
      />

      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReport}
        name={profile.firstName}
      />

      <BlockDialog
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        onConfirm={handleBlock}
        name={profile.firstName}
      />
    </>
  );
}
