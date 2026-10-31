import React, { useEffect, useRef, useState, useCallback } from "react";
import "./styles/ArcadeGame.css";
import { IoClose, IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { HiOutlineSparkles } from "react-icons/hi2";

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  glow: string;
  label: string;
  alive: boolean;
}

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  alpha: number;
  life: number;
}

const SKILL_ROWS = [
  { label: "C++", color: "#38bdf8", glow: "rgba(56, 189, 248, 0.6)" },
  { label: "OOPs", color: "#c084fc", glow: "rgba(192, 132, 252, 0.6)" },
  { label: "HTML5", color: "#fb923c", glow: "rgba(251, 146, 60, 0.6)" },
  { label: "CSS3", color: "#60a5fa", glow: "rgba(96, 165, 250, 0.6)" },
  { label: "DESIGN", color: "#f472b6", glow: "rgba(244, 114, 182, 0.6)" },
];

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const ArcadeGame: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover" | "victory">("start");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Game internal state in refs for 60fps canvas loop
  const paddleRef = useRef({ x: 250, width: 100, height: 12 });
  const ballRef = useRef({ x: 300, y: 350, dx: 3.5, dy: -3.5, radius: 7 });
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const bricksRef = useRef<Brick[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const animFrameRef = useRef<number | null>(null);

  // Play synthetic retro sounds via Web Audio API
  const playSound = useCallback((frequency: number, type: OscillatorType = "sine", duration: number = 0.1) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  }, [soundEnabled]);

  // Load highscore
  useEffect(() => {
    const saved = localStorage.getItem("juned_arcade_high");
    if (saved) {
      setHighScore(parseInt(saved, 10));
    }
  }, []);

  // Initialize Bricks
  const initBricks = useCallback(() => {
    const cols = 6;
    const padding = 8;
    const offsetTop = 45;
    const offsetLeft = 20;
    const brickWidth = (CANVAS_WIDTH - offsetLeft * 2 - padding * (cols - 1)) / cols;
    const brickHeight = 22;

    const bricks: Brick[] = [];
    for (let r = 0; r < SKILL_ROWS.length; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetLeft + c * (brickWidth + padding);
        const y = offsetTop + r * (brickHeight + padding);
        bricks.push({
          x,
          y,
          width: brickWidth,
          height: brickHeight,
          color: SKILL_ROWS[r].color,
          glow: SKILL_ROWS[r].glow,
          label: SKILL_ROWS[r].label,
          alive: true,
        });
      }
    }
    bricksRef.current = bricks;
  }, []);

  // Spawn particle sparks
  const spawnSparks = (x: number, y: number, color: string) => {
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      particlesRef.current.push({
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        life: 0.9,
      });
    }
  };

  // Start new game
  const startGame = () => {
    initBricks();
    paddleRef.current = { x: (CANVAS_WIDTH - 100) / 2, width: 100, height: 12 };
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 60,
      dx: (Math.random() > 0.5 ? 1 : -1) * (3.2 + Math.random() * 0.8),
      dy: -3.8,
      radius: 7,
    };
    trailRef.current = [];
    particlesRef.current = [];
    setScore(0);
    setLives(3);
    setGameState("playing");
    playSound(520, "triangle", 0.15);
  };

  // Main game animation loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      // 1. Clear background
      ctx.fillStyle = "#090610";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Subtle cyber grid lines in canvas
      ctx.strokeStyle = "rgba(168, 85, 247, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // 2. Keyboard paddle movement
      if (keysRef.current.left) {
        paddleRef.current.x = Math.max(0, paddleRef.current.x - 6.5);
      }
      if (keysRef.current.right) {
        paddleRef.current.x = Math.min(CANVAS_WIDTH - paddleRef.current.width, paddleRef.current.x + 6.5);
      }

      // 3. Draw Paddle
      const paddle = paddleRef.current;
      const paddleGrad = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.width, 0);
      paddleGrad.addColorStop(0, "#38bdf8");
      paddleGrad.addColorStop(0.5, "#c084fc");
      paddleGrad.addColorStop(1, "#f472b6");

      ctx.shadowColor = "#c084fc";
      ctx.shadowBlur = 15;
      ctx.fillStyle = paddleGrad;
      ctx.beginPath();
      ctx.roundRect(paddle.x, CANVAS_HEIGHT - 24, paddle.width, paddle.height, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Draw Bricks
      let remaining = 0;
      bricksRef.current.forEach((brick) => {
        if (!brick.alive) return;
        remaining++;

        ctx.shadowColor = brick.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = brick.color;
        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4);
        ctx.fill();

        // Brick label
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Geist, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(brick.label, brick.x + brick.width / 2, brick.y + brick.height / 2);
      });

      // 5. Draw Particles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.08; // subtle gravity
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particlesRef.current.splice(idx, 1);
          return;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 6. Draw Ball & Trail
      const ball = ballRef.current;
      trailRef.current.push({ x: ball.x, y: ball.y });
      if (trailRef.current.length > 7) {
        trailRef.current.shift();
      }

      // Ball trail
      trailRef.current.forEach((pt, i) => {
        const r = ball.radius * ((i + 1) / 8);
        ctx.fillStyle = `rgba(56, 189, 248, ${0.1 + (i / 7) * 0.4})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ball core
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 7. Move Ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collisions (Left & Right)
      if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
        playSound(380, "sine", 0.06);
      } else if (ball.x + ball.radius >= CANVAS_WIDTH) {
        ball.x = CANVAS_WIDTH - ball.radius;
        ball.dx = -Math.abs(ball.dx);
        playSound(380, "sine", 0.06);
      }

      // Top collision
      if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
        playSound(420, "sine", 0.06);
      }

      // Paddle collision
      const paddleY = CANVAS_HEIGHT - 24;
      if (
        ball.y + ball.radius >= paddleY &&
        ball.y - ball.radius <= paddleY + paddle.height &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        ball.dy = -Math.abs(ball.dy);
        // Angle depends on where on paddle it hits
        const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.dx = hitPoint * 4.8;
        ball.y = paddleY - ball.radius - 1;
        playSound(480, "triangle", 0.08);
      }

      // Brick collisions
      bricksRef.current.forEach((brick) => {
        if (!brick.alive) return;
        if (
          ball.x + ball.radius >= brick.x &&
          ball.x - ball.radius <= brick.x + brick.width &&
          ball.y + ball.radius >= brick.y &&
          ball.y - ball.radius <= brick.y + brick.height
        ) {
          brick.alive = false;
          ball.dy = -ball.dy;
          spawnSparks(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
          playSound(750, "square", 0.08);

          setScore((prev) => {
            const nextScore = prev + 100;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem("juned_arcade_high", nextScore.toString());
            }
            return nextScore;
          });
        }
      });

      // Bottom edge (Lose Life)
      if (ball.y + ball.radius >= CANVAS_HEIGHT) {
        setLives((prevLives) => {
          const next = prevLives - 1;
          playSound(220, "sawtooth", 0.25);
          if (next <= 0) {
            setGameState("gameover");
          } else {
            // Reset ball onto paddle
            ballRef.current = {
              x: paddleRef.current.x + paddleRef.current.width / 2,
              y: CANVAS_HEIGHT - 60,
              dx: (Math.random() > 0.5 ? 1 : -1) * 3.5,
              dy: -3.8,
              radius: 7,
            };
          }
          return next;
        });
      }

      // Check Victory
      if (remaining === 0) {
        setGameState("victory");
        playSound(880, "triangle", 0.4);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameState, highScore, playSound]);

  // Mouse & Touch paddle movement on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing" || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    paddleRef.current.x = Math.max(
      0,
      Math.min(CANVAS_WIDTH - paddleRef.current.width, mouseX - paddleRef.current.width / 2)
    );
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing" || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    paddleRef.current.x = Math.max(
      0,
      Math.min(CANVAS_WIDTH - paddleRef.current.width, touchX - paddleRef.current.width / 2)
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true;
      }
      if (e.key === " " && gameState !== "playing") {
        startGame();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isOpen, gameState]);

  return (
    <>
      {/* Floating Arcade Launcher Badge */}
      <button
        className="arcade-launcher"
        onClick={() => {
          setIsOpen(true);
          if (gameState === "start") {
            startGame();
          }
        }}
        aria-label="Open Skill Arcade"
      >
        <span className="arcade-launcher-dot"></span>
        <span className="arcade-launcher-icon">🎮</span>
        <span>Play Skill Breaker</span>
      </button>

      {/* Arcade Modal Overlay */}
      <div className={`arcade-modal-overlay ${isOpen ? "active" : ""}`}>
        <div className="arcade-modal">
          {/* Header */}
          <div className="arcade-header">
            <div className="arcade-title-group">
              <h3>
                <HiOutlineSparkles /> Skill <span>Breaker</span>
              </h3>
              <span className="arcade-badge">Developer Edition</span>
            </div>
            <div className="arcade-header-actions">
              <button
                className="arcade-icon-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? "Mute Sound" : "Enable Sound"}
              >
                {soundEnabled ? <IoVolumeHighOutline /> : <IoVolumeMuteOutline />}
              </button>
              <button
                className="arcade-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close Arcade"
              >
                <IoClose />
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="arcade-status-bar">
            <div className="arcade-stat-item">
              <span>Score:</span>
              <strong>{score}</strong>
            </div>
            <div className="arcade-stat-item">
              <span>High:</span>
              <strong>{highScore}</strong>
            </div>
            <div className="arcade-stat-item">
              <span>Lives:</span>
              <span className="arcade-hearts">
                {"♥".repeat(Math.max(0, lives))}
              </span>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="arcade-canvas-wrap">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="arcade-canvas"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            />

            {/* Start Screen Overlay */}
            {gameState === "start" && (
              <div className="arcade-overlay">
                <h2>Skill Breaker</h2>
                <p>
                  Smash through <strong>C++, OOPs, HTML5, CSS3, &amp; Graphic Design</strong> blocks using your photon paddle!
                </p>
                <button className="arcade-play-btn" onClick={startGame}>
                  Start Playing ✦
                </button>
              </div>
            )}

            {/* Game Over Screen Overlay */}
            {gameState === "gameover" && (
              <div className="arcade-overlay">
                <h2>Game Over</h2>
                <p>You scored <strong>{score}</strong> points! Ready to try again?</p>
                <button className="arcade-play-btn" onClick={startGame}>
                  Try Again ✦
                </button>
              </div>
            )}

            {/* Victory Screen Overlay */}
            {gameState === "victory" && (
              <div className="arcade-overlay">
                <h2>🎉 Skill Master!</h2>
                <p>
                  You cleared all developer blocks with <strong>{score}</strong> points! Outstanding precision.
                </p>
                <button className="arcade-play-btn" onClick={startGame}>
                  Play Again ✦
                </button>
              </div>
            )}
          </div>

          {/* Footer Controls / Hints */}
          <div className="arcade-footer">
            <span>🖱️ Move mouse / touch or use ◄ ► arrow keys to control paddle</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArcadeGame;
