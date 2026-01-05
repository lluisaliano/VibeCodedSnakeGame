import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function MenuPage() {
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
          <CardTitle className="text-2xl">Mission briefing</CardTitle>
          <CardDescription>
            Run it locally, share it on Vercel, and challenge your squad.
          </CardDescription>
          <div className="grid gap-3 text-sm text-white/70">
            <p>Survive the grid as long as you can.</p>
            <p>Grow every time you collect a neon core.</p>
            <p>Restart anytime to chase a higher score.</p>
          </div>
        </Card>
      </section>
    </main>
  );
}
