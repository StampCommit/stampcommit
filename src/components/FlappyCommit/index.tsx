"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FlappyCommit.module.css";

export function FlappyCommit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [scoreDisplay, setScoreDisplay] = useState(0);

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Use refs for the game physics to avoid React re-renders killing performance
  const logic = useRef({
    bird: { x: 50, y: 150, width: 34, height: 34, velocity: 0, gravity: 0.4, jump: -6.5 },
    pipes: [] as { x: number; topH: number; bottomY: number; passed: boolean; destroyed?: boolean }[],
    powerups: [] as { x: number; y: number; text: string; collected: boolean }[],
    sudoTimer: 0,
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
    logic.current.bird.y = logic.current.height / 2;
    logic.current.bird.velocity = 0;
    logic.current.pipes = [];
    logic.current.powerups = [];
    logic.current.sudoTimer = 0;
    logic.current.score = 0;
    logic.current.frames = 0;
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

      // Decrement sudo timer
      if (l.sudoTimer > 0) l.sudoTimer--;

      // Physics
      l.bird.velocity += l.bird.gravity;
      l.bird.y += l.bird.velocity;
      l.frames++;

      // Pipe & Powerup generation
      if (l.frames % 90 === 0) {
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

        // 25% chance to spawn a tech stack "Root Access" pill
        if (Math.random() < 0.25) {
          const tech = ["GO", "RS", "TS", "KMP"][Math.floor(Math.random() * 4)];
          l.powerups.push({
            x: l.width + 60, // offset slightly from pipe
            y: topHeight + (l.gap / 2),
            text: tech,
            collected: false
          });
        }
      }

      ctx.clearRect(0, 0, l.width, l.height);

      // Draw Powerups and handle collection
      for (let i = 0; i < l.powerups.length; i++) {
        const pu = l.powerups[i];
        if (pu.collected) continue;
        pu.x -= l.speed;

        // Draw pill
        ctx.fillStyle = "rgba(255, 189, 46, 0.9)"; // Terminal yellow
        ctx.beginPath();
        ctx.roundRect(pu.x - 20, pu.y - 12, 40, 24, 12);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pu.text, pu.x, pu.y);

        // Collision Check for Powerup
        const dist = Math.hypot((l.bird.x + l.bird.width / 2) - pu.x, (l.bird.y + l.bird.height / 2) - pu.y);
        if (dist < 30) {
          pu.collected = true;
          l.sudoTimer = 400; // ~6 seconds of SUDO Mode
        }
      }

      // Draw Pipes
      ctx.fillStyle = "rgba(0, 153, 255, 0.8)";
      for (let i = 0; i < l.pipes.length; i++) {
        const p = l.pipes[i];
        p.x -= l.speed;
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
          if (l.sudoTimer > 0) {
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

      // Cleanup offscreen objects
      l.pipes = l.pipes.filter(p => p.x > -50);
      l.powerups = l.powerups.filter(pu => pu.x > -50 && !pu.collected);

      // Hit Floor or Ceiling
      if (l.bird.y + l.bird.height > l.height || l.bird.y < 0) {
        if (gameState === "idle") {
          l.bird.velocity = l.bird.jump; // Bounce up
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
      
      // Sudo Mode Aura effect!
      if (l.sudoTimer > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, radius + 10 + Math.sin(l.frames * 0.2) * 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(16, 185, 129, 0.4)"; // Neon green
        ctx.fill();
        ctx.strokeStyle = "rgba(16, 185, 129, 0.8)";
        ctx.lineWidth = 3;
        ctx.stroke();
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

        if (l.sudoTimer > 0) {
          ctx.fillStyle = "#10B981"; // Green
          ctx.font = "bold 16px monospace";
          ctx.fillText("`SUDO` MODE ACTIVE", l.width / 2, 70);
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
