import { NextResponse } from "next/server";

import { ensureScoresTable, getPool } from "@/lib/db";

export async function GET() {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ scores: [] });
  }

  try {
    await ensureScoresTable(pool);
    const [rows] = await pool.execute(
      "SELECT player_name, max_score, updated_at FROM scores ORDER BY max_score DESC, updated_at DESC LIMIT 10"
    );

    return NextResponse.json({ scores: rows });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ scores: [], error: "Failed to load scores" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const pool = getPool();
  if (!pool) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL not set" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const name = String(body.name || "").trim().slice(0, 64);
    const score = Number(body.score || 0);

    if (!name || !Number.isFinite(score)) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    await ensureScoresTable(pool);
    await pool.execute(
      "INSERT INTO scores (player_name, max_score) VALUES (?, ?) ON DUPLICATE KEY UPDATE max_score = GREATEST(max_score, VALUES(max_score)), updated_at = CURRENT_TIMESTAMP",
      [name, Math.max(0, Math.floor(score))]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Failed to save score" }, { status: 500 });
  }
}
