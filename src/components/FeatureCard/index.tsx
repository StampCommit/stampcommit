"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/Icons";
import styles from "./FeatureCard.module.css";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ icon, title, description, index = 0 }: FeatureCardProps) {
  return (
    <motion.div
      className={`${styles.card} glass-card`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.iconWrap}>
        <Icon name={icon} size={24} className={styles.icon} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </motion.div>
  );
}
