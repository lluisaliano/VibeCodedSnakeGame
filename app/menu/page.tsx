"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

interface ScoreRow {
  player_name: string;
  max_score: number;
  updated_at: string;
}

export default function MenuPage() {
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/scores")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setScores(data.scores ?? []);
        }
      })
      .catch(() => {
        if (active) {
          setScores([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-neon/70">
          Neon Arcade Series
        </p>
        <h1 className="font-display text-5xl sm:text-6xl">Snake Protocol</h1>
        <p className="max-w-2xl text-white/70">
          Navigate the neon grid, grow the signal, and dodge the edges. Classic
          snake rules with a modern glow.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2b46,transparent_60%)] opacity-70" />
          <div className="relative flex flex-col gap-6">
            <CardTitle className="text-2xl">Play the run</CardTitle>
            <CardDescription>
              Choose your pilot name and step into the neon arena.
            </CardDescription>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/name">Start mission</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/game">Quick start</Link>
              </Button>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              WASD / Arrow keys
            </p>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <CardTitle className="text-2xl">Top signal pilots</CardTitle>
          <CardDescription>
            Highest verified runs stored in the MariaDB vault.
          </CardDescription>
          <div className="grid gap-3">
            {loading && <p className="text-sm text-white/50">Loading…</p>}
            {!loading && scores.length === 0 && (
              <p className="text-sm text-white/50">
                No scores yet. Be the first to spark the grid.
              </p>
            )}
            {scores.map((score, index) => (
              <div
                key={`${score.player_name}-${score.max_score}-${index}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <div>
                  <p className="font-display text-sm text-neon">
                    {index + 1}. {score.player_name}
                  </p>
                  <p className="text-xs text-white/40">Max score</p>
                </div>
                <p className="font-display text-xl text-neonBlue">
                  {score.max_score}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
