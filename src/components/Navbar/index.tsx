"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#team", label: "Our Team" },
  { href: "/projects", label: "Projects" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={`${styles.nav} container`}>
        <Link href="/" className={styles.logo} aria-label="StampCommit Home">
          <Image
            src="/logo.png"
            alt="StampCommit Logo"
            width={36}
            height={36}
            priority
          />
          <span className={styles.logoText}>
            Stamp<span className={styles.logoAccent}>Commit</span>
          </span>
        </Link>

        <ul className={`${styles.links} ${mobileOpen ? styles.open : ""}`}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${
                  pathname === link.href ? styles.active : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <ThemeToggle />

          <Link href="/#contact" className={`btn btn-outline ${styles.ctaBtn}`}>
            Contact Us
          </Link>

          <Link href="/projects" className={`btn btn-primary ${styles.ctaBtn}`}>
            Explore Projects
          </Link>

          <button
            className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
