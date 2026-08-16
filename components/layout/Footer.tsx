import Link from "next/link";
import styles from "./Footer.module.css";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 8.5h2.5V5h-2.5c-2.2 0-4 1.8-4 4v2H8v3.5h2v6.5h3.5v-6.5h2.6l.4-3.5h-3V9c0-.3.2-.5.5-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Safety", href: "/safety" },
      { label: "Dating Tips", href: "/dating-tips" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logo}>HillBilly Dating</span>
          <p className={styles.tagline}>Find your forever porch partner.</p>
          <div className={styles.social}>
            <a href="https://instagram.com" aria-label="HillBilly Dating on Instagram" target="_blank" rel="noreferrer">
              <InstagramIcon />
            </a>
            <a href="https://facebook.com" aria-label="HillBilly Dating on Facebook" target="_blank" rel="noreferrer">
              <FacebookIcon />
            </a>
          </div>
        </div>
        <div className={styles.columns}>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className={styles.colTitle}>{col.title}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          &copy; {new Date().getFullYear()} HillBilly Dating. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
