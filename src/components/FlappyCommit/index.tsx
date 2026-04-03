"use client";

import styles from "./FlappyCommit.module.css";
import { useFlappyEngine } from "./useFlappyEngine";

export function FlappyCommit() {
  const { containerRef, canvasRef, gameState, scoreDisplay, handleInteraction } = useFlappyEngine();

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
