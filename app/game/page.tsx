"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const GRID_SIZE = 24;
const BASE_TICK = 120;

interface Point {
  x: number;
  y: number;
}

const directions: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 }
};

function pointsEqual(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

function getRandomFreeCell(snake: Point[]) {
  const occupied = new Set(snake.map((segment) => `${segment.x}:${segment.y}`));
  const free: Point[] = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x}:${y}`;
      if (!occupied.has(key)) {
        free.push({ x, y });
      }
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 12, y: 12 };
}

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cellSizeRef = useRef(20);
  const snakeRef = useRef<Point[]>([]);
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const foodRef = useRef<Point>({ x: 12, y: 12 });
  const scoreRef = useRef(0);

  const [status, setStatus] = useState<"idle" | "running" | "over">("idle");
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("Pilot");
  const [message, setMessage] = useState<string | null>(null);
  const [showTouchControls, setShowTouchControls] = useState(false);

  const resizeCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const size = Math.min(container.clientWidth, 520);
    const cellSize = Math.max(12, Math.floor(size / GRID_SIZE));
    const canvasSize = cellSize * GRID_SIZE;
    cellSizeRef.current = cellSize;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cell = cellSizeRef.current;
    const size = cell * GRID_SIZE;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#05060b";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i += 1) {
      const pos = i * cell;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(size, pos);
      ctx.stroke();
    }

    const food = foodRef.current;
    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = "rgba(255,91,213,0.7)";
    ctx.fillStyle = "#ff5bd5";
    ctx.beginPath();
    ctx.arc(
      food.x * cell + cell / 2,
      food.y * cell + cell / 2,
      cell * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.save();
      ctx.shadowBlur = isHead ? 20 : 12;
      ctx.shadowColor = "rgba(76,255,197,0.6)";
      ctx.fillStyle = isHead ? "#6ae4ff" : "#4cffc5";
      ctx.fillRect(
        segment.x * cell + 1,
        segment.y * cell + 1,
        cell - 2,
        cell - 2
      );
      ctx.restore();
    });
  }, []);

  const stopLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const sendScore = useCallback(async (finalScore: number) => {
    const name = localStorage.getItem("snake:name") || "Pilot";
    try {
      await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score: finalScore })
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const step = useCallback(() => {
    const snake = snakeRef.current;
    const currentDir = directionRef.current;
    const nextDir = nextDirectionRef.current;

    if (currentDir.x + nextDir.x !== 0 || currentDir.y + nextDir.y !== 0) {
      directionRef.current = nextDir;
    }

    const head = snake[0];
    const newHead = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y
    };

    const hitWall =
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= GRID_SIZE ||
      newHead.y >= GRID_SIZE;

    const hitSelf = snake.some((segment) => pointsEqual(segment, newHead));

    if (hitWall || hitSelf) {
      stopLoop();
      setStatus("over");
      setMessage("Signal lost. Reboot the run?");
      sendScore(scoreRef.current);
      return;
    }

    snake.unshift(newHead);

    if (pointsEqual(newHead, foodRef.current)) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      foodRef.current = getRandomFreeCell(snake);
    } else {
      snake.pop();
    }

    draw();
  }, [draw, sendScore, stopLoop]);

  const startGame = useCallback(() => {
    const startSnake = [
      { x: 6, y: 12 },
      { x: 5, y: 12 },
      { x: 4, y: 12 },
      { x: 3, y: 12 }
    ];
    snakeRef.current = startSnake;
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    foodRef.current = getRandomFreeCell(startSnake);
    scoreRef.current = 0;
    setScore(0);
    setStatus("running");
    setMessage(null);
    draw();

    stopLoop();
    intervalRef.current = setInterval(step, BASE_TICK);
  }, [draw, step, stopLoop]);

  useEffect(() => {
    const storedName = localStorage.getItem("snake:name");
    if (storedName) {
      setPlayerName(storedName);
    }
    const isTouch =
      typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
    setShowTouchControls(isTouch);
  }, []);

  useEffect(() => {
    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [draw, resizeCanvas]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const next = directions[event.key];
      if (!next) return;
      event.preventDefault();
      nextDirectionRef.current = next;
      if (status === "idle") {
        startGame();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startGame, status]);

  useEffect(() => {
    return () => stopLoop();
  }, [stopLoop]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-display text-xs uppercase tracking-[0.35em] text-neon/70">
            Running mission
          </p>
          <h1 className="font-display text-3xl">{playerName}</h1>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Score
            </p>
            <p className="font-display text-2xl text-neonBlue">{score}</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/menu">Exit</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-8 sm:grid-cols-[1.2fr_0.8fr]">
        <div className="canvas-frame scanline flex flex-col items-center justify-center p-6 touch-none" ref={containerRef}>
          <canvas ref={canvasRef} className="block" />
        </div>

        <Card className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">
              Command
            </p>
            <p className="text-sm text-white/70">
              Eat the neon cores, grow the signal, avoid the walls.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-white/60">
            <p>Move with arrow keys or WASD.</p>
            <p>Score +10 per core.</p>
            <p>Press a direction to start.</p>
          </div>
          {message && (
            <p className="rounded-xl border border-neon/30 bg-neon/10 px-4 py-3 text-sm text-neon">
              {message}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={startGame}>
              {status === "running" ? "Restart" : "Start run"}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/name">Change pilot</Link>
            </Button>
          </div>
          {showTouchControls && (
            <div className="mt-2 rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                Touch controls
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div />
                <button
                  type="button"
                  className="rounded-2xl border border-neon/40 bg-neon/10 py-4 text-sm text-neon"
                  onPointerDown={() => {
                    nextDirectionRef.current = { x: 0, y: -1 };
                    if (status === "idle") startGame();
                  }}
                >
                  Up
                </button>
                <div />
                <button
                  type="button"
                  className="rounded-2xl border border-neon/40 bg-neon/10 py-4 text-sm text-neon"
                  onPointerDown={() => {
                    nextDirectionRef.current = { x: -1, y: 0 };
                    if (status === "idle") startGame();
                  }}
                >
                  Left
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-neon/40 bg-neon/10 py-4 text-sm text-neon"
                  onPointerDown={() => {
                    nextDirectionRef.current = { x: 0, y: 1 };
                    if (status === "idle") startGame();
                  }}
                >
                  Down
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-neon/40 bg-neon/10 py-4 text-sm text-neon"
                  onPointerDown={() => {
                    nextDirectionRef.current = { x: 1, y: 0 };
                    if (status === "idle") startGame();
                  }}
                >
                  Right
                </button>
              </div>
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}
