"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import styles from "./ProjectCard.module.css";

export interface Project {
  slug: string;
  title: string;
  description: string;
  status: "coming-soon" | "active" | "completed";
  tags: string[];
  icon: string;
  featured?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const statusLabel: Record<string, string> = {
    "coming-soon": "Coming Soon",
    active: "Active",
    completed: "Completed",
  };

  const statusClass: Record<string, string> = {
    "coming-soon": "badge-coming-soon",
    active: "badge-green",
    completed: "badge-accent",
  };

  return (
    <motion.div
      className={`${styles.card} glass-card ${project.featured ? styles.featured : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {project.featured && <div className={styles.featuredGlow} />}
      
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <Icon name={project.icon} size={22} className={styles.icon} />
        </div>
        <span className={`badge ${statusClass[project.status]}`}>
          {project.status === "coming-soon" && (
            <span className={styles.pulsingDot} />
          )}
          {statusLabel[project.status]}
        </span>
      </div>

      <h3 className={styles.title}>{project.title}</h3>
      <p className={styles.description}>{project.description}</p>

      <div className={styles.tags}>
        {project.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.cardFooter}>
        {project.status === "coming-soon" ? (
          <span className={styles.comingSoonText}>Stay tuned for updates</span>
        ) : (
          <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
            View Details
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
