import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="glow-line" />
      <div className={`${styles.content} container`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo.png"
                alt="StampCommit"
                width={28}
                height={28}
              />
              <span>
                Stamp<span className={styles.accent}>Commit</span>
              </span>
            </Link>
            <p className={styles.desc}>
              Building innovative software solutions. We build, deliver, and commit to excellence in every project.
            </p>
          </div>

          <div className={styles.columns}>
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Navigation</h4>
              <ul className={styles.columnLinks}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/projects">Projects</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Expertise</h4>
              <ul className={styles.columnLinks}>
                <li>BLE Connectivity</li>
                <li>Flutter</li>
                <li>React Native</li>
                <li>Android / iOS</li>
                <li>IoT &amp; Embedded</li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Connect</h4>
              <ul className={styles.columnLinks}>
                <li>
                  <a href="mailto:admin@stampcommit.com">admin@stampcommit.com</a>
                </li>
                <li>
                  <a href="https://github.com/stampcommit" target="_blank" rel="noopener noreferrer">GitHub</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} StampCommit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
