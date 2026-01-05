"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NamePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    localStorage.setItem("snake:name", trimmed);
    router.push("/game");
  };

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-xl flex-col justify-center gap-8">
      <Card className="flex flex-col gap-6">
        <div className="space-y-2">
          <CardTitle className="text-3xl">Signal identification</CardTitle>
          <CardDescription>
            Lock in a callsign to stamp on the leaderboard.
          </CardDescription>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
            placeholder="Your pilot name"
            autoFocus
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg">
              Launch game
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/menu">Back to menu</Link>
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
