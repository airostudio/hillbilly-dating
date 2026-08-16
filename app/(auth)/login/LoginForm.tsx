"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validation/schemas";
import type { z } from "zod";
import styles from "./LoginForm.module.css";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!supabaseReady) {
      router.push("/discover");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        showToast({
          title: "Couldn't log you in",
          description: error.message || "Check your email and password and try again.",
          tone: "error",
        });
        return;
      }
      router.push("/discover");
    } catch {
      showToast({
        title: "Something went sideways. Give it another go.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      <h1 className={styles.heading}>Welcome back</h1>
      <p className={styles.subhead}>Good to see you again, y&apos;all.</p>

      {!supabaseReady && (
        <div className={styles.demoNote} role="note">
          <Info size={16} aria-hidden="true" />
          <span>
            Supabase isn&apos;t configured yet, so real accounts aren&apos;t available. Use demo
            mode below to explore the app.
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

        <div className={styles.passwordField}>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>

        <div className={styles.forgotRow}>
          <Link href="/forgot-password" className={styles.forgotLink}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
          {supabaseReady ? (isSubmitting ? "Logging in…" : "Log In") : "Continue in demo mode"}
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
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>
          </>
        )}
      </form>

      <p className={styles.footerText}>
        New here?{" "}
        <Link href="/signup" className={styles.footerLink}>
          Create a profile
        </Link>
      </p>
    </div>
  );
}
