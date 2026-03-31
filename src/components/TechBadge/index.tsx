"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { TechItem } from "@/data/projects";
import styles from "./TechBadge.module.css";

interface TechBadgeProps extends TechItem {
  index?: number;
}

export function TechBadge({ name, logo, index = 0 }: TechBadgeProps) {
  return (
    <motion.div
      className={styles.badge}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <Image
        src={logo}
        alt={`${name} logo`}
        width={20}
        height={20}
        className={styles.logo}
        unoptimized
      />
      <span className={styles.name}>{name}</span>
    </motion.div>
  );
}
