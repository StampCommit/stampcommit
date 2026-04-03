"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FlappyCommit.module.css";

export function FlappyCommit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [scoreDisplay, setScoreDisplay] = useState(0);

  // Use refs for the game physics to avoid React re-renders killing performance
  const logic = useRef({
    bird: { x: 50, y: 150, width: 30, height: 30, velocity: 0, gravity: 0.35, jump: -6 },
    pipes: [] as { x: number; topH: number; bottomY: number; passed: boolean }[],
    score: 0,
    frames: 0,
    speed: 2.2,
    gap: 160,
    imgReady: false,
    width: 420,
    height: 380
  });

  // Removed external static image loading; relies purely on native canvas drawing now
  useEffect(() => {
    logic.current.imgReady = true;
    if (gameState === "idle") drawIdle();
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
    
    // Draw Bird floating natively 
    const floatY = l.height / 2 + Math.sin(Date.now() / 300) * 10;
    ctx.save();
    ctx.translate(l.bird.x + l.bird.width / 2, floatY + l.bird.height / 2);
    drawGlowingOrb(ctx, l.bird.width / 2);
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

      // Physics
      l.bird.velocity += l.bird.gravity;
      l.bird.y += l.bird.velocity;
      l.frames++;

      // Pipe generation
      if (l.frames % 90 === 0) {
        const minPipeH = 50;
        const maxPipeH = l.height - l.gap - minPipeH;
        const topHeight = Math.max(minPipeH, Math.random() * maxPipeH);
        
        l.pipes.push({
          x: l.width,
          topH: topHeight,
          bottomY: topHeight + l.gap,
          passed: false
        });
      }

      ctx.clearRect(0, 0, l.width, l.height);

      // Draw Pipes
      ctx.fillStyle = "rgba(0, 153, 255, 0.8)";
      for (let i = 0; i < l.pipes.length; i++) {
        const p = l.pipes[i];
        p.x -= l.speed;
        
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
          if (gameState === "idle") {
            // In attract mode, just ghost through if physics fail slightly
          } else {
            setGameState("gameover");
            setScoreDisplay(l.score);
            return; // Stop rendering
          }
        }

        if (p.x + 50 < bx && !p.passed) {
          l.score++;
          p.passed = true;
          if (gameState === "playing") setScoreDisplay(l.score);
        }
      }

      // Cleanup offscreen pipes
      l.pipes = l.pipes.filter(p => p.x > -50);

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

      // Draw natively generated Bird Model
      ctx.save();
      ctx.translate(l.bird.x + l.bird.width / 2, l.bird.y + l.bird.height / 2);
      ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (l.bird.velocity * 0.1))));
      drawGlowingOrb(ctx, l.bird.width / 2);
      ctx.restore();

      // Draw Score instantly on canvas header
      if (gameState === "playing") {
        ctx.fillStyle = "white";
        ctx.font = "bold 24px monospace";
        ctx.textAlign = "center";
        ctx.fillText(l.score.toString(), l.width / 2, 40);
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
          <p className={styles.instructions}>Tap to fly</p>
          <button className="btn btn-primary btn-sm" onClick={handleInteraction}>
            Play Context
          </button>
        </div>
      )}

      {gameState === "gameover" && (
        <div className={styles.overlay}>
          <p className={styles.instructions}>Score: {scoreDisplay}</p>
          <button className="btn btn-primary btn-sm" onClick={handleInteraction}>
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
