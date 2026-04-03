import { TechItem, BossType } from "./types";

export const BOSS_TYPES: BossType[] = [
  { name: "Merge Conflict", color: "rgba(255, 59, 48, 0.9)", hp: 10, attackSpeed: 1, type: "normal" },
  { name: "Spaghetti Code", color: "rgba(255, 149, 0, 0.9)", hp: 8, attackSpeed: 1.2, type: "erratic" },
  { name: "DDoS Attack", color: "rgba(255, 204, 0, 0.9)", hp: 12, attackSpeed: 3.0, type: "rapid" },
  { name: "Infinite Loop", color: "rgba(88, 86, 214, 0.9)", hp: 15, attackSpeed: 0.8, type: "curve" },
  { name: "Memory Leak", color: "rgba(52, 199, 89, 0.9)", hp: 10, attackSpeed: 1, type: "heal" },
  { name: "Legacy Code", color: "rgba(142, 142, 147, 0.9)", hp: 20, attackSpeed: 0.5, type: "armored" },
  { name: "Null Reference", color: "rgba(175, 82, 222, 0.9)", hp: 1, attackSpeed: 1.5, type: "stealth" },
  { name: "Drop Table", color: "rgba(44, 44, 46, 0.9)", hp: 15, attackSpeed: 1, type: "massive" },
  { name: "Race Condition", color: "rgba(255, 45, 85, 0.9)", hp: 10, attackSpeed: 2, type: "speed" },
  { name: "Prod is Down", color: "rgba(255, 0, 0, 1)", hp: 25, attackSpeed: 2.5, type: "crash_only" },
];

export const TECH_STACK_POWERUPS: readonly TechItem[] = [
  { text: "K8S", effect: "sudo", color: "rgba(50, 108, 229, 0.9)" },
  { text: "RS", effect: "shrink", color: "rgba(222, 104, 33, 0.9)" },
  { text: "GO", effect: "slow", color: "rgba(0, 173, 216, 0.9)" },
  { text: "TS", effect: "typesafe", color: "rgba(49, 120, 198, 0.9)" },
  { text: "C", effect: "leak", color: "rgba(168, 185, 204, 0.9)" },
  { text: "AWS", effect: "cloud", color: "rgba(255, 153, 0, 0.9)" },
  { text: "DB", effect: "heal", color: "rgba(46, 204, 113, 0.9)" },
  { text: "AI", effect: "refactor", color: "rgba(155, 89, 182, 0.9)" },
  { text: "RUST", effect: "rust", color: "rgba(206, 65, 43, 0.9)" },
  { text: "DOCKER", effect: "docker", color: "rgba(36, 150, 237, 0.9)" },
  { text: "LINUX", effect: "linux", color: "rgba(252, 198, 36, 0.9)" },
  { text: "JS", effect: "js", color: "rgba(247, 223, 30, 0.9)" },
  { text: "GIT", effect: "git", color: "rgba(240, 80, 50, 0.9)" },
  { text: "PY", effect: "python", color: "rgba(55, 118, 171, 0.9)" },
  { text: "PHP", effect: "php", color: "rgba(119, 123, 180, 0.9)" },
  { text: "CSS", effect: "css", color: "rgba(21, 114, 182, 0.9)" },
  { text: "NGINX", effect: "nginx", color: "rgba(0, 150, 57, 0.9)" }
] as const;

export const EFFECT_COLORS: Record<string, string> = { sudo: "#326CE5", shrink: "#DE6821", slow: "#00ADD8", typesafe: "#3178C6", leak: "#FF0000", cloud: "#FF9900", rust: "#CE412B", linux: "#FCC624", python: "#3776AB", php: "#777BB4", css: "#1572B6", nginx: "#009639" };
export const EFFECT_LABELS: Record<string, string> = { sudo: "`SUDO` MODE", shrink: "MICROSERVICE", slow: "BANDWIDTH LIMIT", typesafe: "TYPE SAFETY", leak: "MEMORY LEAK", cloud: "CLOUD DEPLOY", rust: "RUST IMMUNITY", linux: "LINUX ROOT", python: "PY FLAT Y-AXIS", php: "PHP BLUR", css: "CSS FLEX STRETCH", nginx: "NGINX CLONES" };
