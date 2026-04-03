import { FeatureCard } from "@/components/FeatureCard";
import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TechBadge } from "@/components/TechBadge";
import { TeamCard } from "@/components/TeamCard";
import { FEATURES, PROJECTS, TECH_STACK, TEAM } from "@/data/projects";
import styles from "./page.module.css";

export default function Home() {
  const featuredProject = PROJECTS.find((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* What We Do */}
      <section className="section" id="what-we-do">
        <div className="container">
          <SectionHeading
            label="Our Expertise"
            title="What We Do"
            subtitle="We specialize in building connected software solutions — from low-level firmware to polished mobile experiences."
          />
          <div className={styles.featureGrid}>
            {FEATURES.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="glow-line" />

      {/* Featured Project */}
      {featuredProject && (
        <section className="section" id="featured">
          <div className="container">
            <SectionHeading
              label="Featured Project"
              title="Our First Milestone"
              subtitle="zPrint is our debut project — bringing BLE-powered wireless printing to the world."
            />
            <div className={styles.featuredWrap}>
              <ProjectCard project={featuredProject} />
            </div>
          </div>
        </section>
      )}

      <div className="glow-line" />

      {/* Tech Stack */}
      <section className="section" id="tech">
        <div className="container">
          <SectionHeading
            label="Technology"
            title="Our Tech Stack"
            subtitle="We use modern, battle-tested technologies to build reliable and scalable solutions."
          />
          <div className={styles.techGrid}>
            {TECH_STACK.map((tech, i) => (
              <TechBadge key={tech.name} {...tech} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="glow-line" />

      {/* Team */}
      <section className="section" id="team">
        <div className="container">
          <SectionHeading
            label="Our People"
            title="Meet the Team"
            subtitle="The experts behind StampCommit building top-tier connected solutions."
          />
          <div className={styles.teamGrid}>
            {TEAM.map((member, i) => (
              <TeamCard key={member.name} {...member} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="glow-line" />

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`} id="contact">
        <div className="container">
          <SectionHeading
            label="Let's Connect"
            title="Have a Project in Mind?"
            subtitle="Whether you need BLE integration, IoT solutions, or custom software — we're ready to build it together."
          />
          <div className={styles.ctaActions}>
            <a href="mailto:admin@stampcommit.com" className="btn btn-primary">
              Start a Conversation
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9h10M10 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
