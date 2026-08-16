import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Your Password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
