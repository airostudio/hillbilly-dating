"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, MessageCircle, Users, UserCircle } from "lucide-react";
import { UserAvatar } from "@/components/dating/UserAvatar";
import { useDemoStore } from "@/lib/demo-store";
import { cn } from "@/lib/utils/cn";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/matches", label: "Matches", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/likes", label: "Likes", icon: Heart },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function Navbar() {
  const pathname = usePathname();
  const { me } = useDemoStore();

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.inner)}>
        <Link href="/discover" className={styles.logo} aria-label="HillBilly Dating home">
          <span className={styles.logoMark}>HB</span>
          <span className={styles.logoText}>HillBilly Dating</span>
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(styles.navLink, active && styles.navLinkActive)}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link href="/profile" className={styles.account} aria-label="Your account">
          <UserAvatar src={me.photos[0]} name={me.firstName} size="sm" />
        </Link>
      </div>
    </header>
  );
}
