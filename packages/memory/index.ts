import sqlite3 from "sqlite3";

import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./ai-os.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS event_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT,
      payload TEXT,
      timestamp INTEGER
    )
  `);
  console.log("DATABASE INITIALIZED");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS executions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workflow_id TEXT,
      status TEXT,
      error TEXT,
      started_at INTEGER,
      ended_at INTEGER
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS processed_emails (
      id TEXT PRIMARY KEY
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      trigger_type TEXT NOT NULL,
      conditions TEXT NOT NULL,
      actions TEXT NOT NULL,
      enabled INTEGER DEFAULT 1,
      created_at INTEGER NOT NULL
    )  
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS dead_letter_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      payload TEXT NOT NULL,
      error TEXT,
      retry_count INTEGER,
      failed_at INTEGER NOT NULL
    )
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      type TEXT,
      content TEXT,   
      metadata TEXT,   
      created_at INTEGER
    )
    `);

  return db;
}
