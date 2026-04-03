"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FlappyCommit.module.css";

export function FlappyCommit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const logic = useRef({
    bird: { x: 50, y: 150, width: 34, height: 34, velocity: 0, gravity: 0.4, jump: -6.5 },
    pipes: [] as { x: number; topH: number; bottomY: number; passed: boolean; destroyed?: boolean }[],
    powerups: [] as { x: number; y: number; text: string; effect: "sudo" | "shrink" | "slow" | "typesafe" | "leak" | "cloud" | "shoot"; color: string; collected: boolean }[],
    projectiles: [] as { x: number; y: number; vx: number; vy: number; type: "bug" | "stamp" }[],
    boss: { active: false, hp: 0, maxHp: 10, x: 500, y: 150, attackTimer: 0 },
    bossesDefeated: 0,
    activeEffect: "none" as "none" | "sudo" | "shrink" | "slow" | "typesafe" | "leak" | "cloud",
    effectTimer: 0,
    score: 0,
    frames: 0,
    speed: 3,
    gap: 160,
    imgReady: false,
    width: 420,
    height: 380
  });

  // Load the logo for the canvas
  useEffect(() => {
    const img = new window.Image();
    img.src = "/logo.png";
    img.onload = () => {
      logic.current.imgReady = true;
      if (gameState === "idle") drawIdle();
    };
    imgRef.current = img;
  }, []);

  // Responsive canvas resize logic
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

  const resetGame = () => {
    const l = logic.current;
    l.bird.y = l.height / 2;
    l.bird.velocity = 0;
    
    // Spawn first pipe near the bird to skip waiting
    const minH = 50;
    const maxH = l.height - l.gap - minH;
    const topH = Math.max(minH, Math.random() * maxH);
    l.pipes = [{ x: 280, topH, bottomY: topH + l.gap, passed: false, destroyed: false }];
    
    l.powerups = [];
    l.projectiles = [];
    l.boss = { active: false, hp: 0, maxHp: 10, x: l.width + 100, y: l.height / 2, attackTimer: 0 };
    l.bossesDefeated = 0;
    
    l.activeEffect = "none";
    l.effectTimer = 0;
    l.bird.width = 34;
    l.bird.height = 34;
    l.score = 0;
    l.frames = 46;
    setScoreDisplay(0);
  };

  const drawIdle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const l = logic.current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Bird floating with logo masked in circle
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

  useEffect(() => {
    if (gameState === "gameover") return; // Freeze screen

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const l = logic.current;
    let animationId: number;

    const gameLoop = () => {
      // Autopilot (Attract Mode)
      if (gameState === "idle") {
        const nextPipe = l.pipes.find(p => p.x + 50 > l.bird.x);
        if (nextPipe) {
          const targetY = (nextPipe.topH + nextPipe.bottomY) / 2;
          if (l.bird.y > targetY + 15 && l.bird.velocity >= 0) {
            l.bird.velocity = l.bird.jump;
          }
        } else {
          if (l.bird.y > l.height / 2 + 20 && l.bird.velocity >= 0) {
            l.bird.velocity = l.bird.jump;
          }
        }
      }

      // Decrement effect timer
      if (l.effectTimer > 0) {
        l.effectTimer--;
        if (l.effectTimer === 0) {
          l.activeEffect = "none";
          l.bird.width = 34; // Restoring size if shrunk
          l.bird.height = 34;
        }
      }

      // TypeSafe Mechanic: Magnetic Auto-Aim!
      if (l.activeEffect === "typesafe") {
        const nextPipes = l.pipes.filter(p => !p.passed && p.x < l.width + 50);
        for (const p of nextPipes) {
          const targetY = (p.topH + p.bottomY) / 2;
          if (targetY < l.bird.y - 10) { p.topH += 1.5; p.bottomY += 1.5; }
          else if (targetY > l.bird.y + 10) { p.topH -= 1.5; p.bottomY -= 1.5; }
        }
      }

      // Physics
      l.bird.velocity += l.bird.gravity;
      l.bird.y += l.bird.velocity;
      l.frames++;
      
      let currentSpeed = l.speed;
      if (l.activeEffect === "slow") currentSpeed = l.speed * 0.55;
      else if (l.activeEffect === "leak") currentSpeed = l.speed * 1.5;

      // Boss Phase Trigger
      const shouldSpawnBoss = l.score >= 15 * (l.bossesDefeated + 1);
      if (shouldSpawnBoss && !l.boss.active && l.pipes.length === 0) {
        l.boss.active = true;
        l.boss.hp = 10 + (l.bossesDefeated * 5);
        l.boss.maxHp = l.boss.hp;
        l.boss.x = l.width + 100;
        l.boss.y = l.height / 2;
        l.boss.attackTimer = 50;
      }

      // Pipe & Powerup generation
      if (l.frames % 90 === 0 && !shouldSpawnBoss && !l.boss.active) {
        const minPipeH = 50;
        const maxPipeH = l.height - l.gap - minPipeH;
        const topHeight = Math.max(minPipeH, Math.random() * maxPipeH);
        
        l.pipes.push({
          x: l.width,
          topH: topHeight,
          bottomY: topHeight + l.gap,
          passed: false,
          destroyed: false
        });

        // 40% chance to spawn a tech stack item
        if (Math.random() < 0.4) {
          const techs = [
            { text: "K8S", effect: "sudo", color: "rgba(50, 108, 229, 0.9)" }, // Sudo: smash
            { text: "RS", effect: "shrink", color: "rgba(222, 104, 33, 0.9)" },  // Shrink: small hitbox
            { text: "GO", effect: "slow", color: "rgba(0, 173, 216, 0.9)" },    // Slow: slow speed
            { text: "TS", effect: "typesafe", color: "rgba(49, 120, 198, 0.9)" }, // TypeSafe: magnet
            { text: "C", effect: "leak", color: "rgba(168, 185, 204, 0.9)" }, // Leak: fast speed trap
            { text: "AWS", effect: "cloud", color: "rgba(255, 153, 0, 0.9)" } // Cloud: floor bounce
          ] as const;
          const tech = techs[Math.floor(Math.random() * techs.length)];
          
          l.powerups.push({
            x: l.width + 60, // offset slightly from pipe
            y: topHeight + (l.gap / 2),
            text: tech.text,
            effect: tech.effect,
            color: tech.color,
            collected: false
          });
        }
      }

      ctx.clearRect(0, 0, l.width, l.height);
      
      // Boss AI
      if (l.boss.active) {
        // Track player seamlessly
        l.boss.y += (l.bird.y - l.boss.y) * 0.05;
        if (l.boss.x > l.width - 60) l.boss.x -= 1;
        
        l.boss.attackTimer--;
        if (l.boss.attackTimer <= 0) {
           l.boss.attackTimer = 40 + Math.random() * 40;
           l.projectiles.push({
             x: l.boss.x - 20, y: l.boss.y,
             vx: - (currentSpeed + 2 + Math.random()*2), 
             vy: (l.bird.y - l.boss.y) * 0.02,
             type: "bug"
           });
        }
        
        // Spawn Weapon STAMP powerups
        if (Math.random() < 0.02) {
            l.powerups.push({
               x: l.width + 20, y: Math.max(50, Math.min(l.height - 50, l.bird.y + (Math.random() * 100 - 50))),
               text: "STAMP", effect: "shoot", color: "rgba(255, 215, 0, 0.9)", collected: false
            });
        }
      }

      // Draw Powerups and handle collection
      for (let i = 0; i < l.powerups.length; i++) {
        const pu = l.powerups[i];
        if (pu.collected) continue;
        pu.x -= currentSpeed;

        // Draw pill
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

        // Collision Check for Powerup
        const dist = Math.hypot((l.bird.x + l.bird.width / 2) - pu.x, (l.bird.y + l.bird.height / 2) - pu.y);
        if (dist < 30) {
          pu.collected = true;
          if (pu.effect === "shoot") {
            l.projectiles.push({
              x: l.bird.x + l.bird.width, y: l.bird.y + l.bird.height / 2,
              vx: 8, vy: 0, type: "stamp"
            });
            l.score++; // Passive point for collecting shot
            if (gameState === "playing") setScoreDisplay(l.score);
          } else {
            l.activeEffect = pu.effect;
            l.effectTimer = pu.effect === "sudo" ? 400 : 500; 
            if (pu.effect === "shrink") {
              l.bird.width = 18;
              l.bird.height = 18;
            }
          }
        }
      }

      // Draw Pipes
      ctx.fillStyle = "rgba(0, 153, 255, 0.8)";
      for (let i = 0; i < l.pipes.length; i++) {
        const p = l.pipes[i];
        p.x -= currentSpeed;
        if (p.destroyed) continue;
        
        // Top pipe
        ctx.fillRect(p.x, 0, 50, p.topH);
        
        // Bottom pipe
        ctx.fillRect(p.x, p.bottomY, 50, l.height - p.bottomY);
        
        // Pipe accents
        ctx.fillStyle = "rgba(0, 255, 255, 1)";
        ctx.fillRect(p.x, p.topH - 10, 50, 10);
        ctx.fillRect(p.x, p.bottomY, 50, 10);
        ctx.fillStyle = "rgba(0, 153, 255, 0.8)";

        // Collision Check
        const bx = l.bird.x;
        const by = l.bird.y;
        const bw = l.bird.width;
        const bh = l.bird.height;

        if (
          bx + bw - 5 > p.x && bx + 5 < p.x + 50 &&
          (by + 5 < p.topH || by + bh - 5 > p.bottomY)
        ) {
          if (l.activeEffect === "sudo") {
            // FIREWALL DESTROYED! Sudo mode smashes it.
            p.destroyed = true;
            l.score += 2; // Bonus points for destroying firewalls
            if (gameState === "playing") setScoreDisplay(l.score);
            // Draw explosion effect
            ctx.fillStyle = "rgba(255, 95, 86, 0.8)";
            ctx.beginPath();
            ctx.arc(p.x + 25, l.bird.y, 40, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(0, 153, 255, 0.8)"; // revert
          } else if (gameState === "idle") {
            // In attract mode, just ghost through if physics fail slightly
          } else {
            setGameState("gameover");
            setScoreDisplay(l.score);
            return; // Stop rendering
          }
        }

        if (p.x + 50 < bx && !p.passed && !p.destroyed) {
          l.score++;
          p.passed = true;
          if (gameState === "playing") setScoreDisplay(l.score);
        }
      }

      // Projectiles System
      for (let i = 0; i < l.projectiles.length; i++) {
        const p = l.projectiles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.type === "bug") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 59, 48, 0.9)";
          ctx.fill();
        } else if (p.type === "stamp") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 215, 0, 1)";
          ctx.fill();
          ctx.fillStyle = "black";
          ctx.font = "bold 10px monospace";
          ctx.fillText("✓", p.x, p.y);
        }

        // Combat Collision 
        if (p.type === "bug") {
          const dist = Math.hypot((l.bird.x + l.bird.width/2) - p.x, (l.bird.y + l.bird.height/2) - p.y);
          if (dist < 18) {
             if (l.activeEffect === "sudo" || l.activeEffect === "cloud") {
               p.type = "stamp"; // deflect back!
               p.vx = 8;
             } else if (gameState !== "idle") {
               setGameState("gameover");
               setScoreDisplay(l.score);
               return;
             }
          }
        } else if (p.type === "stamp" && l.boss.active) {
          const bossDist = Math.hypot(l.boss.x - p.x, l.boss.y - p.y);
          if (bossDist < 45) {
             l.boss.hp--;
             p.x = -100; // destroy projectile
             if (l.boss.hp <= 0) {
               l.boss.active = false;
               l.bossesDefeated++;
               l.score += 20; // Defeat bonus!
               if (gameState === "playing") setScoreDisplay(l.score);
               l.projectiles = []; 
               break;
             }
          }
        }
      }
      l.projectiles = l.projectiles.filter(p => p.x > -50 && p.x < l.width + 50);

      // Boss Rendering
      if (l.boss.active) {
        ctx.save();
        ctx.translate(l.boss.x, l.boss.y);
        ctx.rotate(Math.sin(l.frames * 0.05) * 0.1);
        
        ctx.fillStyle = "rgba(255, 59, 48, 0.2)";
        ctx.beginPath();
        ctx.arc(0, 0, 50 + Math.sin(l.frames * 0.3) * 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "rgba(255, 59, 48, 0.9)";
        ctx.beginPath();
        ctx.roundRect(-25, -25, 50, 50, 8);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("! ><", 0, 0); 
        ctx.restore();
      }

      // Cleanup offscreen objects
      l.pipes = l.pipes.filter(p => p.x > -50);
      l.powerups = l.powerups.filter(pu => pu.x > -50 && !pu.collected);

      // Hit Floor or Ceiling
      if (l.bird.y + l.bird.height > l.height || l.bird.y < 0) {
        if (gameState === "idle" || l.activeEffect === "cloud") {
          l.bird.y = Math.max(0, Math.min(l.height - l.bird.height, l.bird.y));
          l.bird.velocity = l.bird.jump * (l.bird.y < 50 ? -1 : 1); // Bounce
        } else {
          setGameState("gameover");
          setScoreDisplay(l.score);
          return;
        }
      }

      // Draw natively generated Bird Model or Masked Logo
      const radius = l.bird.width / 2;
      ctx.save();
      ctx.translate(l.bird.x + radius, l.bird.y + radius);
      
      // Dynamic Aura effects!
      if (l.activeEffect === "sudo") {
        ctx.beginPath();
        ctx.arc(0, 0, radius + 10 + Math.sin(l.frames * 0.2) * 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(50, 108, 229, 0.4)"; // Neon Blue
        ctx.fill();
        ctx.strokeStyle = "rgba(50, 108, 229, 0.8)";
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (l.activeEffect === "shrink") {
        ctx.beginPath();
        ctx.arc(0, 0, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(222, 104, 33, 0.8)"; // Orange
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (l.activeEffect === "slow") {
        ctx.beginPath();
        ctx.arc(0, 0, radius + 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 173, 216, 0.3)"; // Cyan
        ctx.fill();
      } else if (l.activeEffect === "typesafe") {
        ctx.beginPath();
        ctx.arc(0, 0, radius + 12, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(49, 120, 198, 0.6)"; 
        ctx.lineWidth = 4;
        ctx.stroke();
      } else if (l.activeEffect === "leak") {
        ctx.beginPath();
        ctx.arc(Math.random()*4-2, Math.random()*4-2, radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)"; 
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (l.activeEffect === "cloud") {
        ctx.beginPath();
        ctx.arc(0, radius + 4, 8, 0, Math.PI * 2);
        ctx.arc(-8, radius + 2, 6, 0, Math.PI * 2);
        ctx.arc(8, radius + 2, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; 
        ctx.fill();
      }

      ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (l.bird.velocity * 0.1))));
      
      if (l.imgReady && imgRef.current) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(imgRef.current, -radius, -radius, l.bird.width, l.bird.height);
      } else {
        drawGlowingOrb(ctx, radius);
      }
      ctx.restore();

      // Draw Score and Status instantly on canvas header
      if (gameState === "playing") {
        ctx.fillStyle = "white";
        ctx.font = "bold 24px monospace";
        ctx.textAlign = "center";
        ctx.fillText(l.score.toString(), l.width / 2, 40);

        if (l.boss.active) {
          const hpW = 200;
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(l.width/2 - hpW/2, 60, hpW, 10);
          ctx.fillStyle = "rgba(255, 59, 48, 0.9)";
          ctx.fillRect(l.width/2 - hpW/2, 60, hpW * (l.boss.hp / l.boss.maxHp), 10);
          ctx.fillStyle = "white";
          ctx.font = "bold 12px monospace";
          ctx.fillText("MERGE CONFLICT", l.width/2, 55);
        }

        if (l.activeEffect !== "none") {
          const colors = { sudo: "#326CE5", shrink: "#DE6821", slow: "#00ADD8", typesafe: "#3178C6", leak: "#FF0000", cloud: "#FF9900" };
          const labels = { sudo: "`SUDO` MODE", shrink: "MICROSERVICE", slow: "BANDWIDTH LIMIT", typesafe: "TYPE SAFETY", leak: "MEMORY LEAK", cloud: "CLOUD DEPLOY" };
          ctx.fillStyle = colors[l.activeEffect];
          ctx.font = "bold 16px monospace";
          // Render lower if boss is active to avoid overlap
          ctx.fillText(labels[l.activeEffect] + " ACTIVE", l.width / 2, l.boss.active ? 95 : 70);
        }
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => cancelAnimationFrame(animationId);
  }, [gameState]);

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent | KeyboardEvent) => {
    // Prevent default scrolling on spacebar if focused
    if ("code" in e && e.code === "Space") e.preventDefault();

    if (gameState === "idle" || gameState === "gameover") {
      resetGame();
      setGameState("playing");
    } else if (gameState === "playing") {
      logic.current.bird.velocity = logic.current.bird.jump;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        handleInteraction(e);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  return (
    <div className={styles.container} ref={containerRef}>
      <canvas 
        ref={canvasRef} 
        className={styles.canvas} 
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
      />
      
      {gameState === "idle" && (
        <div className={styles.overlay}>
          <button 
            className="btn btn-primary" 
            style={{ padding: '16px', borderRadius: '50%' }} 
            onClick={handleInteraction}
            aria-label="Play"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}

      {gameState === "gameover" && (
        <div className={styles.overlay}>
          <p className={styles.instructions}>Score: {scoreDisplay}</p>
          <button 
            className="btn btn-primary" 
            style={{ padding: '16px', borderRadius: '50%' }} 
            onClick={handleInteraction}
            aria-label="Restart"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
