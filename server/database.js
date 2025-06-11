import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const DB_PATH = path.join(__dirname, 'mediaget.db');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create download_tasks table
      db.run(`
        CREATE TABLE IF NOT EXISTS download_tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          task_id TEXT UNIQUE NOT NULL,
          media_type TEXT NOT NULL,
          platform_name TEXT NOT NULL,
          url TEXT NOT NULL,
          media_info TEXT,
          status TEXT DEFAULT 'pending',
          progress INTEGER DEFAULT 0,
          result TEXT,
          error TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating download_tasks table:', err);
          reject(err);
        }
      });

      // Create indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_user_id ON download_tasks(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_task_id ON download_tasks(task_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_status ON download_tasks(status)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_created_at ON download_tasks(created_at)`);

      // Create trigger to update updated_at timestamp
      db.run(`
        CREATE TRIGGER IF NOT EXISTS update_download_tasks_updated_at 
        AFTER UPDATE ON download_tasks
        BEGIN
          UPDATE download_tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
      `, (err) => {
        if (err) {
          console.error('Error creating trigger:', err);
          reject(err);
        } else {
          console.log('Database initialized successfully');
          resolve();
        }
      });
    });
  });
}

// Database operations for download tasks
export class DownloadTaskDB {
  static async createTask(taskData) {
    return new Promise((resolve, reject) => {
      const {
        user_id,
        task_id,
        media_type,
        platform_name,
        url,
        media_info
      } = taskData;

      const stmt = db.prepare(`
        INSERT INTO download_tasks (
          user_id, task_id, media_type, platform_name, url, media_info
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        user_id,
        task_id,
        media_type,
        platform_name,
        url,
        JSON.stringify(media_info)
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            task_id,
            ...taskData
          });
        }
      });

      stmt.finalize();
    });
  }

  static async getTaskById(task_id) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM download_tasks WHERE task_id = ?',
        [task_id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            if (row) {
              row.media_info = row.media_info ? JSON.parse(row.media_info) : null;
              row.result = row.result ? JSON.parse(row.result) : null;
            }
            resolve(row);
          }
        }
      );
    });
  }

  static async getUserTasks(user_id, limit = 100, offset = 0) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM download_tasks 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [user_id, limit, offset],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const tasks = rows.map(row => ({
              ...row,
              media_info: row.media_info ? JSON.parse(row.media_info) : null,
              result: row.result ? JSON.parse(row.result) : null
            }));
            resolve(tasks);
          }
        }
      );
    });
  }

  static async getPendingTasks(limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM download_tasks 
         WHERE status = 'pending' 
         ORDER BY created_at ASC 
         LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const tasks = rows.map(row => ({
              ...row,
              media_info: row.media_info ? JSON.parse(row.media_info) : null,
              result: row.result ? JSON.parse(row.result) : null
            }));
            resolve(tasks);
          }
        }
      );
    });
  }

  static async updateTaskStatus(task_id, status, progress = null, result = null, error = null) {
    return new Promise((resolve, reject) => {
      let query = 'UPDATE download_tasks SET status = ?';
      let params = [status];

      if (progress !== null) {
        query += ', progress = ?';
        params.push(progress);
      }

      if (result !== null) {
        query += ', result = ?';
        params.push(JSON.stringify(result));
      }

      if (error !== null) {
        query += ', error = ?';
        params.push(error);
      }

      query += ' WHERE task_id = ?';
      params.push(task_id);

      db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  static async deleteTask(task_id, user_id) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM download_tasks WHERE task_id = ? AND user_id = ?',
        [task_id, user_id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });
  }

  static async getTaskStats(user_id) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
           status,
           COUNT(*) as count
         FROM download_tasks 
         WHERE user_id = ?
         GROUP BY status`,
        [user_id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const stats = {
              total: 0,
              pending: 0,
              processing: 0,
              completed: 0,
              failed: 0
            };

            rows.forEach(row => {
              stats[row.status] = row.count;
              stats.total += row.count;
            });

            resolve(stats);
          }
        }
      );
    });
  }
}

export default db;