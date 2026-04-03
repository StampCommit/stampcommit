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
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname === "/") {
        const sections = NAV_LINKS.map(l => l.href.split("#")[1]).filter(Boolean);
        let currentHash = "";

        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // If the section is within the viewing area (top in the upper third)
            if (rect.top <= 300 && rect.bottom >= 300) {
              currentHash = `#${id}`;
              break;
            }
          }
        }

        // Reset if we are at the top of the page
        if (window.scrollY < 100) {
          currentHash = "";
        }

        setActiveHash(currentHash);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Trigger instantly
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && activeHash === "";
    if (href.startsWith("/#")) {
      return pathname === "/" && activeHash === href.substring(1);
    }
    return pathname === href;
  };

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
                  isActive(link.href) ? styles.active : ""
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
