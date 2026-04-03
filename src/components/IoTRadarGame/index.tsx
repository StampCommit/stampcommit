"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/Icons";
import styles from "./IoTRadarGame.module.css";

const NODE_TYPES = ["mobile", "cloud", "cpu", "printer", "zap", "sparkles"];
const GAME_DURATION = 30; // seconds

interface ActiveNode {
  id: string;
  type: string;
  x: number;
  y: number;
  createdAt: number;
}

export function IoTRadarGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [nodes, setNodes] = useState<ActiveNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameOver, setGameOver] = useState(false);

  // Main game loop
  useEffect(() => {
    if (!isPlaying) return;

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Spawner
    const spawner = setInterval(() => {
      spawnNode();
    }, 1200); // spawn a new node every 1.2 seconds

    // Cleanup stale nodes
    const cleaner = setInterval(() => {
      const now = Date.now();
      setNodes((prev) => prev.filter((node) => now - node.createdAt < 4000)); // node lives for 4 seconds
    }, 500);

    return () => {
      clearInterval(timer);
      clearInterval(spawner);
      clearInterval(cleaner);
    };
  }, [isPlaying]);

  const spawnNode = () => {
    const type = NODE_TYPES[Math.floor(Math.random() * NODE_TYPES.length)];
    const id = Math.random().toString(36).substr(2, 9);
    
    // Calculate random position (avoiding absolute edges and exact center)
    // We want x between 10 and 90, but not between 40-60 (center hub)
    const getCoord = () => {
      const isLeft = Math.random() > 0.5;
      if (isLeft) {
        return 10 + Math.random() * 25; // 10% to 35%
      }
      return 65 + Math.random() * 25; // 65% to 90%
    };

    setNodes((prev) => [
      ...prev,
      {
        id,
        type,
        x: getCoord(),
        y: getCoord(),
        createdAt: Date.now(),
      },
    ]);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setNodes([]);
    setGameOver(false);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    setNodes([]);
  };

  const handleNodeClick = (id: string) => {
    if (!isPlaying) return;
    // Play a tiny ping noise or effect in a real app, here we just visual
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setScore((s) => s + 10);
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.radarCard} glass-card`} ref={containerRef}>
        
        {/* Background Radar Visuals */}
        <div className={`${styles.radarRing} ${styles.ring1}`} />
        <div className={`${styles.radarRing} ${styles.ring2}`} />
        <div className={`${styles.radarRing} ${styles.ring3}`} />
        <div className={styles.scanLine} />

        {/* Center Hub */}
        <div className={styles.hub}>
          <Icon name="bluetooth" size={28} />
        </div>

        {/* Stats Overlay */}
        {isPlaying && (
          <div className={styles.stats}>
            <div className={styles.statBadge}>Score: {score}</div>
            <div className={styles.statBadge}>TIME: 00:{timeLeft.toString().padStart(2, '0')}</div>
          </div>
        )}

        {/* Nodes */}
        <AnimatePresence>
          {nodes.map((node) => (
            <motion.button
              key={node.id}
              className={styles.node}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => handleNodeClick(node.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              whileTap={{ scale: 0.8 }}
            >
              <Icon name={node.type} size={20} />
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Overlays */}
        <AnimatePresence>
          {!isPlaying && !gameOver && (
            <motion.div 
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className={styles.title}>IoT Pairing Radar</h3>
              <p className={styles.desc}>
                Devices are appearing rapidly! Click them to establish BLE and IoT connections before they time out.
              </p>
              <button className="btn btn-primary" onClick={startGame}>
                Initiate Pairing sequence
              </button>
            </motion.div>
          )}

          {gameOver && (
            <motion.div 
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3 className={styles.title}>Session Complete</h3>
              <p className={styles.desc}>
                You established <strong>{score / 10}</strong> secure IoT connections holding a unified network score of {score}. 
              </p>
              <button className="btn btn-primary" onClick={startGame}>
                Run Diagnostics Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
