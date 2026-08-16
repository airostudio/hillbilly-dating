"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldAlert, UserX, Flag, PauseCircle, Trash2 } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/dating/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useDemoStore } from "@/lib/demo-store";
import { ToggleSwitch } from "./ToggleSwitch";
import styles from "./SettingsView.module.css";

interface PrivacyState {
  hideProfile: boolean;
  showApproximateLocation: boolean;
  readReceipts: boolean;
  showOnlineStatus: boolean;
}

interface NotificationState {
  newMatches: boolean;
  newMessages: boolean;
}

export function SettingsView() {
  const { me } = useDemoStore();
  const { showToast } = useToast();
  const router = useRouter();
  const supabaseReady = isSupabaseConfigured();

  const [notifications, setNotifications] = useState<NotificationState>({
    newMatches: true,
    newMessages: true,
  });

  const [privacy, setPrivacy] = useState<PrivacyState>({
    hideProfile: false,
    showApproximateLocation: true,
    readReceipts: true,
    showOnlineStatus: true,
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function updatePrivacy<K extends keyof PrivacyState>(key: K, value: PrivacyState[K]) {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  }

  function updateNotification<K extends keyof NotificationState>(
    key: K,
    value: NotificationState[K],
  ) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  }

  async function handleChangePassword() {
    setPasswordError(null);
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    setChangingPassword(true);
    try {
      if (supabaseReady) {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          setPasswordError(error.message || "Couldn't update your password.");
          return;
        }
      }
      showToast({ title: "Password updated", tone: "success" });
      setPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showToast({ title: "Something went sideways. Give it another go.", tone: "error" });
    } finally {
      setChangingPassword(false);
    }
  }

  function handlePauseAccount() {
    setPauseDialogOpen(false);
    showToast({ title: "Account paused — see you soon.", tone: "info" });
  }

  function handleDeleteAccount() {
    setDeleteDialogOpen(false);
    showToast({ title: "Account deleted", description: "Sorry to see you go.", tone: "info" });
    router.push("/");
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Account Settings</h1>

      <div className={styles.sections}>
        <Card>
          <CardHeader>
            <h2 className={styles.cardTitle}>Account</h2>
          </CardHeader>
          <CardBody className={styles.cardBody}>
            <Input
              label="Email"
              type="email"
              disabled
              value={`${me.firstName.toLowerCase() || "you"}@hillbilly.example`}
              hint={
                supabaseReady
                  ? "Managed by your Supabase account."
                  : "Demo mode doesn't use real email accounts."
              }
            />
            <div className={styles.passwordRow}>
              <div>
                <p className={styles.rowLabel}>Password</p>
                <p className={styles.rowHint}>Change the password used to sign in.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setPasswordDialogOpen(true)}
              >
                <KeyRound size={16} aria-hidden="true" /> Change Password
              </Button>
            </div>
            <ToggleSwitch
              label="New match notifications"
              description="Get notified when you match with someone new."
              checked={notifications.newMatches}
              onChange={(v) => updateNotification("newMatches", v)}
            />
            <ToggleSwitch
              label="New message notifications"
              description="Get notified when someone sends you a message."
              checked={notifications.newMessages}
              onChange={(v) => updateNotification("newMessages", v)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className={styles.cardTitle}>Privacy</h2>
          </CardHeader>
          <CardBody className={styles.cardBody}>
            <ToggleSwitch
              label="Hide my profile"
              description="Stop showing your profile in Discover for other users."
              checked={privacy.hideProfile}
              onChange={(v) => updatePrivacy("hideProfile", v)}
            />
            <ToggleSwitch
              label="Show approximate location only"
              description="Display a rounded distance instead of your exact location."
              checked={privacy.showApproximateLocation}
              onChange={(v) => updatePrivacy("showApproximateLocation", v)}
            />
            <ToggleSwitch
              label="Read receipts"
              description="Let matches see when you've read their messages."
              checked={privacy.readReceipts}
              onChange={(v) => updatePrivacy("readReceipts", v)}
            />
            <ToggleSwitch
              label="Show online status"
              description="Let matches see when you're active on HillBilly Dating."
              checked={privacy.showOnlineStatus}
              onChange={(v) => updatePrivacy("showOnlineStatus", v)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className={styles.cardTitle}>Safety</h2>
          </CardHeader>
          <CardBody className={styles.cardBody}>
            <div className={styles.safetyGroup}>
              <h3 className={styles.safetyLabel}>Blocked users</h3>
              <EmptyState
                icon={<UserX size={28} aria-hidden="true" />}
                title="You haven't blocked anyone."
                description="Folks you block won't be able to see your profile or message you."
              />
            </div>
            <div className={styles.safetyGroup}>
              <h3 className={styles.safetyLabel}>Report history</h3>
              <EmptyState
                icon={<Flag size={28} aria-hidden="true" />}
                title="No reports filed."
                description="Reports you've submitted about other users will show up here."
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className={styles.cardTitle}>Account Actions</h2>
          </CardHeader>
          <CardBody className={styles.cardBody}>
            <div className={styles.dangerRow}>
              <div>
                <p className={styles.rowLabel}>Pause account</p>
                <p className={styles.rowHint}>
                  Temporarily hide your profile. You can come back any time.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => setPauseDialogOpen(true)}>
                <PauseCircle size={16} aria-hidden="true" /> Pause Account
              </Button>
            </div>
            <div className={styles.dangerRow}>
              <div>
                <p className={styles.rowLabel}>Delete account</p>
                <p className={styles.rowHint}>
                  Permanently delete your profile and all your data. This can&apos;t be undone.
                </p>
              </div>
              <Button type="button" variant="danger" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 size={16} aria-hidden="true" /> Delete Account
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        title="Change Password"
        description="Choose a new password for your account."
      >
        <div className={styles.dialogForm}>
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            hint="At least 8 characters."
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordError ?? undefined}
          />
          <div className={styles.dialogActions}>
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={handleChangePassword}
              disabled={changingPassword}
            >
              {changingPassword ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={pauseDialogOpen}
        onClose={() => setPauseDialogOpen(false)}
        title="Pause your account?"
        description="Your profile will be hidden from Discover until you come back and reactivate it."
      >
        <div className={styles.dialogActions}>
          <Button type="button" variant="ghost" onClick={() => setPauseDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={handlePauseAccount}>
            <PauseCircle size={16} aria-hidden="true" /> Yes, pause my account
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        title="Delete your account?"
        description="This permanently removes your profile, matches, and messages. This can't be undone."
      >
        <div className={styles.dialogActions}>
          <Button type="button" variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
            <ShieldAlert size={16} aria-hidden="true" /> Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleDeleteAccount}>
            <Trash2 size={16} aria-hidden="true" /> Yes, delete my account
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
