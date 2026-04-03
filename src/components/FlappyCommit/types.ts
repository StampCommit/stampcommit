export type EffectType = "none" | "sudo" | "shrink" | "slow" | "typesafe" | "leak" | "cloud" | "rust" | "linux" | "python" | "php" | "css" | "nginx";

export type PowerupEffect = EffectType | "shoot" | "heal" | "refactor" | "docker" | "js" | "git";

export type ProjectileType = "bug" | "stamp" | "crash";

export interface TechItem {
  text: string;
  effect: PowerupEffect;
  color: string;
}

export interface BossType {
  name: string;
  color: string;
  hp: number;
  attackSpeed: number;
  type: "normal" | "erratic" | "rapid" | "curve" | "heal" | "armored" | "stealth" | "massive" | "speed" | "crash_only";
}

export interface Pipe {
  x: number;
  topH: number;
  bottomY: number;
  passed: boolean;
  destroyed?: boolean;
}

export interface Powerup {
  x: number;
  y: number;
  text: string;
  effect: PowerupEffect;
  color: string;
  collected: boolean;
}

export interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: ProjectileType;
}

export interface GameLogicState {
  lives: number;
  invincibility: number;
  hasShield: boolean;
  hasRevive: boolean;
  bird: { x: number; y: number; width: number; height: number; velocity: number; gravity: number; jump: number; };
  pipes: Pipe[];
  powerups: Powerup[];
  projectiles: Projectile[];
  boss: { active: boolean; hp: number; maxHp: number; x: number; y: number; attackTimer: number; name: string; };
  bossesDefeated: number;
  activeEffect: EffectType;
  effectTimer: number;
  score: number;
  frames: number;
  speed: number;
  gap: number;
  imgReady: boolean;
  width: number;
  height: number;
}
