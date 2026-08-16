import Link from "next/link";
import { Card } from "@/components/ui/Card";
import styles from "./auth-layout.module.css";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <div className={styles.glowTop} aria-hidden="true" />
      <div className={styles.glowBottom} aria-hidden="true" />
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>HB</span>
          <span>HillBilly Dating</span>
        </Link>
        <Card className={styles.card}>{children}</Card>
      </div>
    </div>
  );
}
