import type { Metadata } from "next";
import { Rye, Mulish } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { DemoStoreProvider } from "@/lib/demo-store";
import "./globals.css";

const rye = Rye({
  variable: "--font-rye",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "HillBilly Dating — Find Your Forever Porch Partner",
    template: "%s — HillBilly Dating",
  },
  description:
    "Meet country-loving singles looking for genuine connections, good conversation, and somebody to share the porch with.",
  openGraph: {
    title: "HillBilly Dating — Find Your Forever Porch Partner",
    description:
      "Meet country-loving singles looking for genuine connections, good conversation, and somebody to share the porch with.",
    siteName: "HillBilly Dating",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HillBilly Dating — Find Your Forever Porch Partner",
    description:
      "Meet country-loving singles looking for genuine connections, good conversation, and somebody to share the porch with.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${rye.variable} ${mulish.variable}`}>
      <body>
        <DemoStoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </DemoStoreProvider>
      </body>
    </html>
  );
}
