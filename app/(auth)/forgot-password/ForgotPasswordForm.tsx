"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { forgotPasswordSchema } from "@/lib/validation/schemas";
import type { z } from "zod";
import styles from "./ForgotPasswordForm.module.css";

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    if (!supabaseReady) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
      await supabase.auth.resetPasswordForEmail(values.email, { redirectTo });
    } catch {
      // Deliberately swallowed — never reveal whether the request failed
      // because the email doesn't exist. Network/config errors just fall
      // through to the same success state below.
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className={styles.wrap}>
        <div className={styles.successIcon} aria-hidden="true">
          <MailCheck size={28} />
        </div>
        <h1 className={styles.heading}>Check your inbox</h1>
        <p className={styles.subhead}>
          If an account exists for that email, we&apos;ve sent a reset link. It should show up
          shortly — be sure to check your spam folder too.
        </p>
        <Button href="/login" variant="primary" size="lg" fullWidth>
          Back to Log In
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Forgot your password?</h1>
      <p className={styles.subhead}>
        No worries — tell us the email on your account and we&apos;ll send you a link to reset it.
      </p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send Reset Link"}
        </Button>
      </form>

      <p className={styles.footerText}>
        Remembered it after all?{" "}
        <Link href="/login" className={styles.footerLink}>
          Back to log in
        </Link>
      </p>
    </div>
  );
}
