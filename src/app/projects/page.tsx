import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { PROJECTS } from "@/data/projects";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects — StampCommit",
  description:
    "Explore StampCommit's projects — innovative software solutions for BLE connectivity, IoT, and embedded systems. Our first project, zPrint, is coming soon.",
};

export default function ProjectsPage() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading
          label="Our Work"
          title="Projects"
          subtitle="From BLE-powered devices to cloud-connected platforms — explore the solutions we're building."
        />

        {/* Stats bar */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{PROJECTS.length}</span>
            <span className={styles.statLabel}>Projects</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {PROJECTS.filter((p) => p.status === "coming-soon").length}
            </span>
            <span className={styles.statLabel}>Coming Soon</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {new Set(PROJECTS.flatMap((p) => p.tags)).size}
            </span>
            <span className={styles.statLabel}>Technologies</span>
          </div>
        </div>

        {/* Project grid */}
        <div className={styles.grid}>
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        {/* More coming section */}
        <div className={styles.moreComing}>
          <div className={`${styles.moreCard} glass-card`}>
            <div className={styles.moreIcon}>🚀</div>
            <h3 className={styles.moreTitle}>More Projects Coming</h3>
            <p className={styles.moreDesc}>
              We&apos;re constantly building new solutions. Stay tuned for upcoming
              projects in BLE, IoT, mobile, and beyond.
            </p>
            <a
              href="mailto:admin@stampcommit.com"
              className="btn btn-outline"
              style={{ marginTop: "var(--space-md)" }}
            >
              Collaborate With Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
