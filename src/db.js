import Database from 'better-sqlite3';

const db = new Database('data.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS sensor_data(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value REAL,
    humidity REAL,
    timestamp INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function insertReading(value, humidity, timestamp) {
  const stmt = db.prepare('INSERT INTO sensor_data (value, humidity, timestamp) VALUES (?, ?, ?)');
  const { lastInsertRowid } = stmt.run(value, humidity, timestamp);
  return db.prepare('SELECT created_at FROM sensor_data WHERE id = ?').get(lastInsertRowid).created_at;
}

function getHistory(limit = 50) {
  return db.prepare('SELECT * FROM sensor_data ORDER BY id DESC LIMIT ?').all(limit);
}

export { insertReading, getHistory };
