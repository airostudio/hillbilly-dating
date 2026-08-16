import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import styles from "./Footer.module.css";

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
              <Instagram size={20} aria-hidden="true" />
            </a>
            <a href="https://facebook.com" aria-label="HillBilly Dating on Facebook" target="_blank" rel="noreferrer">
              <Facebook size={20} aria-hidden="true" />
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
