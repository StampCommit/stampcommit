"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import { FlappyCommit } from "@/components/FlappyCommit";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  const [showGameOnMobile, setShowGameOnMobile] = useState(false);
  
  return (
    <section className={styles.hero}>
      <div className={`${styles.content} container`}>
        <motion.div
          className={styles.textBlock}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.logoLine}>
            <Image
              src="/logo.png"
              alt="StampCommit"
              width={52}
              height={52}
              priority
              className={styles.heroLogo}
            />
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} />
              <span>Shipping Soon</span>
            </div>
          </div>

          <h1 className={styles.title}>
            We <span className={styles.highlight}>Build</span>.{" "}
            <span className={styles.highlight}>Deliver</span>.{" "}
            <span className={styles.highlight}>Commit</span>.
          </h1>

          <p className={styles.subtitle}>
            Software solutions that push boundaries — specializing in BLE
            connectivity, IoT systems, and embedded technology. From concept to
            deployment, we stamp every commit with quality.
          </p>

          <div className={styles.actions}>
            <Link href="/projects" className="btn btn-primary">
              <span>Explore Our Projects</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4 9h10M10 5l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <a href="mailto:admin@stampcommit.com" className="btn btn-outline">
              Get in Touch
            </a>
          </div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Desktop view always shows the game wrapper. On Mobile, it's conditionally rendered. */}
          <div className={`${styles.gameContainer} ${showGameOnMobile ? styles.mobileOpen : ''}`}>
            <FlappyCommit />
            
            {/* Close button for mobile when open */}
            {showGameOnMobile && (
              <button 
                className={styles.closeMobileGame} 
                onClick={() => setShowGameOnMobile(false)}
                aria-label="Close game"
              >
                ×
              </button>
            )}
          </div>

          {/* Mobile toggle button when game is hidden */}
          {!showGameOnMobile && (
            <button 
              className={styles.mobileGameToggle}
              onClick={() => setShowGameOnMobile(true)}
            >
              <Icon name="zap" size={24} />
              <span>Play Flappy Commit</span>
            </button>
          )}

        </motion.div>
      </div>

      {/* Decorative scan line */}
      <div className={styles.scanLine} aria-hidden="true" />
    </section>
  );
}
