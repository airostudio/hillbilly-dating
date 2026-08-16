"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { signupSchema } from "@/lib/validation/schemas";
import type { z } from "zod";
import styles from "./SignupForm.module.css";

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignupFormValues) => {
    if (!supabaseReady) {
      router.push("/onboarding");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      if (error) {
        showToast({
          title: "Couldn't create your account",
          description: error.message || "Give it another shot in a moment.",
          tone: "error",
        });
        return;
      }
      router.push("/onboarding");
    } catch {
      showToast({
        title: "Something went sideways. Give it another go.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({ provider: "google" });
    } catch {
      showToast({
        title: "Something went sideways. Give it another go.",
        tone: "error",
      });
    }
  };

  return (
    <div className={styles.wrap}>
      <h1 className={styles.heading}>Create your profile</h1>
      <p className={styles.subhead}>Let&apos;s get your porch profile started.</p>
      <p className={styles.stepNote}>
        This is step one of a friendly, guided setup — after this you&apos;ll walk through a
        short onboarding to tell us a bit about yourself.
      </p>

      {!supabaseReady && (
        <div className={styles.demoNote} role="note">
          <Info size={16} aria-hidden="true" />
          <span>
            Supabase isn&apos;t configured yet, so real accounts aren&apos;t available. Continuing
            will drop you straight into demo onboarding.
          </span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          hint="At least 8 characters."
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
          {supabaseReady
            ? isSubmitting
              ? "Creating your profile…"
              : "Create Profile"
            : "Continue in demo mode"}
        </Button>

        {supabaseReady && (
          <>
            <div className={styles.divider}>
              <span>or</span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleGoogleSignup}
            >
              Continue with Google
            </Button>
          </>
        )}
      </form>

      <p className={styles.footerText}>
        Already have a profile?{" "}
        <Link href="/login" className={styles.footerLink}>
          Log in
        </Link>
      </p>
    </div>
  );
}
