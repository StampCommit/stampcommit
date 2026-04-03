import { useEffect, useRef, useState } from "react";
import { BOSS_TYPES, TECH_STACK_POWERUPS, EFFECT_COLORS, EFFECT_LABELS } from "./constants";
import type { GameLogicState } from "./types";

export function useFlappyEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const logic = useRef<GameLogicState>({
    lives: 5,
    invincibility: 0,
    hasShield: false,
    hasRevive: false,
    bird: { x: 50, y: 150, width: 34, height: 34, velocity: 0, gravity: 0.4, jump: -6.5 },
    pipes: [],
    powerups: [],
    projectiles: [],
    boss: { active: false, hp: 0, maxHp: 10, x: 500, y: 150, attackTimer: 0, name: "" },
    bossesDefeated: 0,
    activeEffect: "none",
    effectTimer: 0,
    score: 0,
    frames: 0,
    speed: 3,
    gap: 160,
    imgReady: false,
    width: 420,
    height: 380
  });

  const drawIdle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const l = logic.current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const floatY = l.height / 2 + Math.sin(Date.now() / 300) * 10;
    const radius = l.bird.width / 2;
    ctx.save();
    ctx.translate(l.bird.x + radius, floatY + radius);
    if (l.imgReady && imgRef.current) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(imgRef.current, -radius, -radius, l.bird.width, l.bird.height);
    } else {
      drawGlowingOrb(ctx, radius);
    }
    ctx.restore();
  };

  const drawGlowingOrb = (ctx: CanvasRenderingContext2D, radius: number) => {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 153, 255, 0.9)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fill();
  };

  const resetGame = () => {
    const l = logic.current;
    l.bird.y = l.height / 2;
    l.bird.velocity = 0;
    l.lives = 5;
    l.invincibility = 0;
    const minH = 50;
    const maxH = l.height - l.gap - minH;
    const topH = Math.max(minH, Math.random() * maxH);
    l.pipes = [{ x: 280, topH, bottomY: topH + l.gap, passed: false, destroyed: false }];
    l.powerups = [];
    l.projectiles = [];
    l.boss = { active: false, hp: 0, maxHp: 10, x: l.width + 100, y: l.height / 2, attackTimer: 0, name: "" };
    l.bossesDefeated = 0;
    l.activeEffect = "none";
    l.hasShield = false;
    l.hasRevive = false;
    l.effectTimer = 0;
    l.bird.width = 34;
    l.bird.height = 34;
    l.score = 0;
    l.frames = 46;
    setScoreDisplay(0);
  };

  const handleInteraction = (e?: React.MouseEvent | React.TouchEvent | KeyboardEvent) => {
    if (e && "code" in e && e.code === "Space") e.preventDefault();
    if (gameState === "idle" || gameState === "gameover") {
      resetGame();
      setGameState("playing");
    } else if (gameState === "playing") {
      logic.current.bird.velocity = logic.current.bird.jump;
    }
  };

  useEffect(() => {
    const img = new window.Image();
    img.src = "/logo.png";
    img.onload = () => {
      logic.current.imgReady = true;
      if (gameState === "idle") drawIdle();
    };
    imgRef.current = img;
  }, []);

  useEffect(() => {
    const resize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
        logic.current.width = clientWidth;
        logic.current.height = clientHeight;
        if (gameState === "idle") drawIdle();
      }
    };
    window.addEventListener("resize", resize);
    resize();
    return () => window.removeEventListener("resize", resize);
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") handleInteraction(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "gameover") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const l = logic.current;
    let animationId: number;

    const gameLoop = () => {
      const takeDamage = () => {
        if (l.invincibility > 0 || l.activeEffect === "rust") return false;
        if (l.hasShield) { l.hasShield = false; l.invincibility = 30; return false; }
        l.lives--;
        if (l.lives <= 0) {
          if (l.hasRevive) {
             l.hasRevive = false;
             l.lives = 3;
             l.invincibility = 120;
             l.bird.y = l.height/2;
             return false;
          }
          setGameState("gameover");
          setScoreDisplay(l.score);
          return true;
        }
        l.invincibility = 60;
        return false;
      };

      if (l.invincibility > 0) l.invincibility--;

      if (gameState === "idle") {
        const nextPipe = l.pipes.find(p => p.x + 50 > l.bird.x);
        if (nextPipe) {
          const targetY = (nextPipe.topH + nextPipe.bottomY) / 2;
          if (l.bird.y > targetY + 15 && l.bird.velocity >= 0) l.bird.velocity = l.bird.jump;
        } else {
          if (l.bird.y > l.height / 2 + 20 && l.bird.velocity >= 0) l.bird.velocity = l.bird.jump;
        }
      }

      if (l.effectTimer > 0) {
        l.effectTimer--;
        if (l.effectTimer === 0) {
          l.activeEffect = "none";
          l.bird.width = 34;
          l.bird.height = 34;
        }
      }

      if (l.activeEffect === "typesafe") {
        const nextPipes = l.pipes.filter(p => !p.passed && p.x < l.width + 50);
        for (const p of nextPipes) {
          const targetY = (p.topH + p.bottomY) / 2;
          if (targetY < l.bird.y - 10) { p.topH += 1.5; p.bottomY += 1.5; }
          else if (targetY > l.bird.y + 10) { p.topH -= 1.5; p.bottomY -= 1.5; }
        }
      }

      if (l.activeEffect === "python") { l.bird.gravity = 0.1; l.bird.jump = -3; }
      else if (l.activeEffect === "linux") { l.bird.gravity = 0.6; l.bird.jump = -10; }
      else { l.bird.gravity = 0.4; l.bird.jump = -6.5; }

      l.bird.velocity += l.bird.gravity;
      l.bird.y += l.bird.velocity;
      l.frames++;
      
      let currentSpeed = l.speed;
      if (l.activeEffect === "slow") currentSpeed = l.speed * 0.55;
      else if (l.activeEffect === "leak") currentSpeed = l.speed * 1.5;

      const shouldSpawnBoss = l.score >= 15 * (l.bossesDefeated + 1);
      if (shouldSpawnBoss && !l.boss.active && l.pipes.length === 0) {
        const bType = BOSS_TYPES[l.bossesDefeated % BOSS_TYPES.length];
        l.boss.active = true;
        l.boss.name = bType.name;
        l.boss.hp = bType.hp + (Math.floor(l.bossesDefeated / 10) * 10);
        l.boss.maxHp = l.boss.hp;
        l.boss.x = l.width + 100;
        l.boss.y = l.height / 2;
        l.boss.attackTimer = 50;
      }

      if (l.frames % 90 === 0 && !shouldSpawnBoss && !l.boss.active) {
        const minPipeH = 50;
        const maxPipeH = l.height - l.gap - minPipeH;
        const spawnedY = Math.max(minPipeH, Math.random() * maxPipeH);
        
        l.pipes.push({ 
           x: l.width, 
           topH: spawnedY, 
           bottomY: spawnedY + l.gap, 
           passed: false, 
           destroyed: false
        });
        
        if (Math.random() < 0.45) {
          const tech = TECH_STACK_POWERUPS[Math.floor(Math.random() * TECH_STACK_POWERUPS.length)];
          l.powerups.push({
            x: l.width + 60, y: spawnedY + (l.gap / 2),
            text: tech.text, effect: tech.effect, color: tech.color, collected: false
          });
        }
      }

      ctx.clearRect(0, 0, l.width, l.height);
      
      if (l.boss.active) {
        const bType = BOSS_TYPES[l.bossesDefeated % BOSS_TYPES.length];
        if (bType.type === "erratic") l.boss.y += (Math.random() * l.height - l.boss.y) * 0.1;
        else l.boss.y += (l.bird.y - l.boss.y) * 0.05;
        
        if (l.boss.x > l.width - 60) l.boss.x -= 1;
        
        l.boss.attackTimer--;
        if (l.boss.attackTimer <= 0) {
           l.boss.attackTimer = (40 + Math.random() * 40) / bType.attackSpeed;
           const isCrash = bType.type === "crash_only" || Math.random() < 0.25;
           if (isCrash) l.projectiles.push({ x: l.boss.x - 20, y: l.boss.y, vx: -(currentSpeed + 5), vy: 0, type: "crash" });
           else l.projectiles.push({ x: l.boss.x - 20, y: l.boss.y, vx: -(currentSpeed + 2 + Math.random()*2), vy: bType.type === "curve" ? (l.bird.y - l.boss.y) * 0.05 : (l.bird.y - l.boss.y) * 0.02, type: "bug" });
        }
        
        if (bType.type === "heal" && l.frames % 120 === 0 && l.boss.hp < l.boss.maxHp) l.boss.hp++;
        if (Math.random() < 0.02) l.powerups.push({ x: l.width + 20, y: Math.max(50, Math.min(l.height - 50, l.bird.y + (Math.random() * 100 - 50))), text: "STAMP", effect: "shoot", color: "rgba(255, 215, 0, 0.9)", collected: false });
      }

      for (let i = 0; i < l.powerups.length; i++) {
        const pu = l.powerups[i];
        if (pu.collected) continue;
        pu.x -= currentSpeed;

        ctx.fillStyle = pu.color;
        ctx.beginPath();
        ctx.roundRect(pu.x - 20, pu.y - 12, 40, 24, 12);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.stroke();

        ctx.fillStyle = "#FFF";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pu.text, pu.x, pu.y);

        const dist = Math.hypot((l.bird.x + l.bird.width / 2) - pu.x, (l.bird.y + l.bird.height / 2) - pu.y);
        if (dist < 30) {
          pu.collected = true;
          if (pu.effect === "shoot") {
            l.projectiles.push({ x: l.bird.x + l.bird.width, y: l.bird.y + l.bird.height / 2, vx: 8, vy: 0, type: "stamp" });
            l.score++; 
            if (gameState === "playing") setScoreDisplay(l.score);
          } else if (pu.effect === "heal") {
            l.lives = Math.min(5, l.lives + 1);
            l.score += 2;
            if (gameState === "playing") setScoreDisplay(l.score);
          } else if (pu.effect === "refactor") {
            l.pipes.forEach(p => p.destroyed = true);
            l.projectiles.forEach(pr => { if (pr.type === "bug" || pr.type === "crash") { pr.type = "stamp"; pr.vx = 8; pr.vy = 0; } });
            l.score += 5;
            if (gameState === "playing") setScoreDisplay(l.score);
          } else if (pu.effect === "docker") {
             l.hasShield = true;
          } else if (pu.effect === "git") {
             l.hasRevive = true;
          } else if (pu.effect === "js") {
             l.pipes.forEach(p => { if (p.x > l.bird.x && p.x < l.bird.x + 300) p.x += 200; });
             l.projectiles.forEach(pr => pr.x += 150);
             l.score += 2;
          } else {
            l.activeEffect = pu.effect;
            l.effectTimer = 400; 
            if (pu.effect === "shrink") { l.bird.width = 18; l.bird.height = 18; }
            else if (pu.effect === "css") { l.bird.width = 60; l.bird.height = 14; }
          }
        }
      }

      ctx.fillStyle = "rgba(0, 153, 255, 0.8)";
      for (let i = 0; i < l.pipes.length; i++) {
        const p = l.pipes[i];
        p.x -= currentSpeed;
        if (p.destroyed) continue;
        
        ctx.fillRect(p.x, 0, 50, p.topH);
        ctx.fillRect(p.x, p.bottomY, 50, l.height - p.bottomY);
        
        ctx.fillStyle = "rgba(0, 255, 255, 1)";
        ctx.fillRect(p.x, p.topH - 10, 50, 10);
        ctx.fillRect(p.x, p.bottomY, 50, 10);
        ctx.fillStyle = "rgba(0, 153, 255, 0.8)";

        const bx = l.bird.x; const by = l.bird.y; const bw = l.bird.width; const bh = l.bird.height;
        if (bx + bw - 5 > p.x && bx + 5 < p.x + 50 && (by + 5 < p.topH || by + bh - 5 > p.bottomY)) {
          if (l.activeEffect === "sudo") {
            p.destroyed = true; l.score += 2;
            if (gameState === "playing") setScoreDisplay(l.score);
            ctx.fillStyle = "rgba(255, 95, 86, 0.8)";
            ctx.beginPath();
            ctx.arc(p.x + 25, l.bird.y, 40, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 153, 255, 0.8)";
          } else if (gameState !== "idle" && takeDamage()) {
             return;
          }
        }
        if (p.x + 50 < bx && !p.passed && !p.destroyed) {
          l.score++; p.passed = true;
          if (gameState === "playing") setScoreDisplay(l.score);
        }
      }

      for (let i = 0; i < l.projectiles.length; i++) {
        const p = l.projectiles[i];
        p.x += p.vx; p.y += p.vy;
        
        if (p.type === "bug") {
          ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fillStyle = "rgba(255, 59, 48, 0.9)"; ctx.fill();
        } else if (p.type === "crash") {
          ctx.beginPath(); ctx.rect(p.x - 12, p.y - 12, 24, 24); ctx.fillStyle = "rgba(155, 89, 182, 0.9)"; ctx.fill();
          ctx.fillStyle = "white"; ctx.font = "bold 8px monospace"; ctx.fillText("502", p.x, p.y + 3);
        } else if (p.type === "stamp") {
          ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.fillStyle = "rgba(255, 215, 0, 1)"; ctx.fill();
          ctx.fillStyle = "black"; ctx.font = "bold 10px monospace"; ctx.fillText("✓", p.x, p.y);
        }

        if (p.type === "bug" || p.type === "crash") {
          const hitRadius = p.type === "crash" ? 22 : 18;
          const dist = Math.hypot((l.bird.x + l.bird.width/2) - p.x, (l.bird.y + l.bird.height/2) - p.y);
          if (dist < hitRadius) {
             if (p.type === "bug" && (l.activeEffect === "sudo" || l.activeEffect === "cloud")) {
               p.type = "stamp"; p.vx = 8;
             } else if (gameState !== "idle") {
               if (takeDamage()) return;
               p.x = -100;
             }
          }
        } else if (p.type === "stamp" && l.boss.active) {
          const bossDist = Math.hypot(l.boss.x - p.x, l.boss.y - p.y);
          const bType = BOSS_TYPES[l.bossesDefeated % BOSS_TYPES.length];
          const hitRadius = bType.type === "massive" ? 80 : 45;
          if (bossDist < hitRadius) {
             l.boss.hp -= bType.type === "armored" ? 0.5 : 1;
             p.x = -100;
             if (l.boss.hp <= 0) {
               l.boss.active = false; l.bossesDefeated++; l.score += 20;
               if (gameState === "playing") setScoreDisplay(l.score);
               l.projectiles = []; break;
             }
          }
        }
      }
      l.projectiles = l.projectiles.filter(p => p.x > -50 && p.x < l.width + 50);

      if (l.boss.active) {
        const bType = BOSS_TYPES[l.bossesDefeated % BOSS_TYPES.length];
        ctx.save();
        ctx.translate(l.boss.x, l.boss.y);
        ctx.rotate(Math.sin(l.frames * 0.05) * 0.1);
        ctx.fillStyle = bType.color.replace("0.9", "0.2").replace("1)", "0.2)");
        ctx.beginPath();
        const sizeMult = bType.type === "massive" ? 2.5 : 1;
        ctx.arc(0, 0, (50 * sizeMult) + Math.sin(l.frames * 0.3) * 10, 0, Math.PI * 2);
        ctx.fill();
        if (bType.type === "stealth" && (l.frames % 100) > 15) ctx.globalAlpha = 0.1;
        ctx.fillStyle = bType.color;
        ctx.beginPath();
        ctx.roundRect(-25 * sizeMult, -25 * sizeMult, 50 * sizeMult, 50 * sizeMult, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "white"; ctx.font = `bold ${20 * sizeMult}px monospace`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("! ><", 0, 0);
        ctx.globalAlpha = 1.0; ctx.restore();
      }

      l.pipes = l.pipes.filter(p => p.x > -50);
      l.powerups = l.powerups.filter(pu => pu.x > -50 && !pu.collected);

      if (l.bird.y + l.bird.height > l.height || l.bird.y < 0) {
        if (gameState === "idle" || l.activeEffect === "cloud") {
          l.bird.y = Math.max(0, Math.min(l.height - l.bird.height, l.bird.y));
          l.bird.velocity = l.bird.jump * (l.bird.y < 50 ? -1 : 1);
        } else {
          l.bird.y = Math.max(0, Math.min(l.height - l.bird.height, l.bird.y));
          l.bird.velocity = l.bird.jump * (l.bird.y < 50 ? -1 : 1);
          if (takeDamage()) return;
        }
      }

      const radius = l.bird.width / 2;
      ctx.save();
      ctx.translate(l.bird.x + radius, l.bird.y + radius);
      
      if (l.activeEffect === "sudo") {
        ctx.beginPath(); ctx.arc(0, 0, radius + 10 + Math.sin(l.frames * 0.2) * 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(50, 108, 229, 0.4)"; ctx.fill(); ctx.strokeStyle = "rgba(50, 108, 229, 0.8)"; ctx.lineWidth = 3; ctx.stroke();
      } else if (l.activeEffect === "shrink") {
        ctx.beginPath(); ctx.arc(0, 0, radius + 6, 0, Math.PI * 2); ctx.strokeStyle = "rgba(222, 104, 33, 0.8)"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
      } else if (l.activeEffect === "slow") {
        ctx.beginPath(); ctx.arc(0, 0, radius + 8, 0, Math.PI * 2); ctx.fillStyle = "rgba(0, 173, 216, 0.3)"; ctx.fill();
      } else if (l.activeEffect === "typesafe") {
        ctx.beginPath(); ctx.arc(0, 0, radius + 12, 0, Math.PI * 2); ctx.strokeStyle = "rgba(49, 120, 198, 0.6)"; ctx.lineWidth = 4; ctx.stroke();
      } else if (l.activeEffect === "leak") {
        ctx.beginPath(); ctx.arc(Math.random()*4-2, Math.random()*4-2, radius + 6, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255, 0, 0, 0.8)"; ctx.lineWidth = 2; ctx.stroke();
      } else if (l.activeEffect === "cloud") {
        ctx.beginPath(); ctx.arc(0, radius + 4, 8, 0, Math.PI * 2); ctx.arc(-8, radius + 2, 6, 0, Math.PI * 2); ctx.arc(8, radius + 2, 6, 0, Math.PI * 2); ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; ctx.fill();
      }

      ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (l.bird.velocity * 0.1))));
      if (l.invincibility > 0 && Math.floor(l.frames / 4) % 2 === 0) ctx.globalAlpha = 0.4;
      
      if (l.imgReady && imgRef.current) {
        ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.clip(); ctx.drawImage(imgRef.current, -radius, -radius, l.bird.width, l.bird.height);
      } else { drawGlowingOrb(ctx, radius); }
      ctx.globalAlpha = 1.0; ctx.restore();

      if (gameState === "playing") {
        ctx.fillStyle = "white"; ctx.font = "bold 24px monospace"; ctx.textAlign = "center"; ctx.fillText(l.score.toString(), l.width / 2, 40);
        ctx.textAlign = "left"; ctx.font = "bold 20px monospace"; ctx.fillStyle = l.lives <= 1 ? "rgba(255, 59, 48, 1)" : "rgba(16, 185, 129, 1)"; ctx.fillText("♥️".repeat(l.lives), 20, 30);
        ctx.font = "bold 14px monospace"; ctx.fillStyle = "rgba(36, 150, 237, 1)"; if (l.hasShield) ctx.fillText("[🛡️ DOCKER]", 20, 55);
        ctx.fillStyle = "rgba(240, 80, 50, 1)"; if (l.hasRevive) ctx.fillText("[🔄 GIT REVIVE]", 20, l.hasShield ? 75 : 55);

        if (l.boss.active) {
          const hpW = 200; ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(l.width/2 - hpW/2, 60, hpW, 10);
          ctx.fillStyle = BOSS_TYPES[l.bossesDefeated % BOSS_TYPES.length].color; ctx.fillRect(l.width/2 - hpW/2, 60, hpW * (l.boss.hp / l.boss.maxHp), 10);
          ctx.fillStyle = "white"; ctx.font = "bold 12px monospace"; ctx.fillText(l.boss.name, l.width/2, 55);
        }

        if (l.activeEffect !== "none") {
          ctx.fillStyle = EFFECT_COLORS[l.activeEffect] || "#FFF"; ctx.font = "bold 16px monospace";
          ctx.fillText((EFFECT_LABELS[l.activeEffect] || l.activeEffect.toUpperCase()) + " ACTIVE", l.width / 2, l.boss.active ? 95 : 70);
        }
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  return { containerRef, canvasRef, gameState, scoreDisplay, handleInteraction };
}
