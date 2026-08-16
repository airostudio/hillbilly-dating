import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./MarketingHeader.module.css";

export function MarketingHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>HB</span>
          <span>HillBilly Dating</span>
        </Link>
        <nav className={styles.nav} aria-label="Marketing">
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#stories">Stories</Link>
        </nav>
        <div className={styles.actions}>
          <Button href="/login" variant="ghost">
            Log In
          </Button>
          <Button href="/signup" variant="primary">
            Join Free
          </Button>
        </div>
      </div>
    </header>
  );
}
