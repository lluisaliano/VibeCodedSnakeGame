import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return null;
  }
  if (!pool) {
    pool = mysql.createPool({
      uri: databaseUrl,
      connectionLimit: 10
    });
  }
  return pool;
}

export async function ensureScoresTable(pool: mysql.Pool) {
  await pool.execute(
    `CREATE TABLE IF NOT EXISTS scores (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player_name VARCHAR(64) NOT NULL,
      max_score INT NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_player (player_name)
    )`
  );
}
