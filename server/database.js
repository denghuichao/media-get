import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default data directory: ~/data/media-get
const DEFAULT_DATA_DIR = path.join(os.homedir(), 'data', 'media-get');
const DATA_DIR = process.env.DATA_DIR || DEFAULT_DATA_DIR;

// Database file path
const DB_PATH = path.join(DATA_DIR, 'mediaget.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`Created data directory: ${DATA_DIR}`);
}

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log(`Connected to SQLite database at: ${DB_PATH}`);
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
          cookies TEXT,
          is_playlist BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating download_tasks table:', err);
          reject(err);
        }
      });

      // Create user_cookies table for storing user cookies
      db.run(`
        CREATE TABLE IF NOT EXISTS user_cookies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL,
          platform_name TEXT NOT NULL,
          cookies_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, platform_name)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating user_cookies table:', err);
          reject(err);
        }
      });

      // Add is_playlist column to existing tables if it doesn't exist
      db.run(`
        ALTER TABLE download_tasks ADD COLUMN is_playlist BOOLEAN DEFAULT 0
      `, (err) => {
        // Ignore error if column already exists
        if (err && !err.message.includes('duplicate column name')) {
          console.error('Error adding is_playlist column:', err);
        }
      });

      // Create indexes
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_user_id ON download_tasks(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_task_id ON download_tasks(task_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_status ON download_tasks(status)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_platform ON download_tasks(platform_name)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_media_type ON download_tasks(media_type)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_created_at ON download_tasks(created_at)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_download_tasks_is_playlist ON download_tasks(is_playlist)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_user_cookies_user_id ON user_cookies(user_id)`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_user_cookies_platform ON user_cookies(platform_name)`);

      // Create trigger to update updated_at timestamp
      db.run(`
        CREATE TRIGGER IF NOT EXISTS update_download_tasks_updated_at 
        AFTER UPDATE ON download_tasks
        BEGIN
          UPDATE download_tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
      `);

      db.run(`
        CREATE TRIGGER IF NOT EXISTS update_user_cookies_updated_at 
        AFTER UPDATE ON user_cookies
        BEGIN
          UPDATE user_cookies SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
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
  // Create a new download task
  static async createTask(taskData) {
    return new Promise((resolve, reject) => {
      const {
        user_id,
        task_id,
        media_type,
        platform_name,
        url,
        media_info,
        cookies,
        is_playlist = false
      } = taskData;

      const stmt = db.prepare(`
        INSERT INTO download_tasks (
          user_id, task_id, media_type, platform_name, url, media_info, cookies, is_playlist
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        user_id,
        task_id,
        media_type,
        platform_name,
        url,
        JSON.stringify(media_info),
        cookies || null,
        is_playlist ? 1 : 0
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

  // Update task progress and status
  static async updateTaskProgress(task_id, progress, status = null) {
    return new Promise((resolve, reject) => {
      let query = 'UPDATE download_tasks SET progress = ?';
      let params = [progress];

      if (status !== null) {
        query += ', status = ?';
        params.push(status);
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

  // Mark task as completed with result
  static async completeTask(task_id, result) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE download_tasks SET status = ?, progress = ?, result = ? WHERE task_id = ?',
        ['completed', 100, JSON.stringify(result), task_id],
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

  // Mark task as failed with error
  static async failTask(task_id, error) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE download_tasks SET status = ?, progress = ?, error = ? WHERE task_id = ?',
        ['failed', 100, error, task_id],
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

  // Mark files as cleaned up (invalid status)
  static async markFilesCleanedUp(task_ids) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(task_ids) || task_ids.length === 0) {
        resolve({ changes: 0 });
        return;
      }

      const placeholders = task_ids.map(() => '?').join(',');
      const query = `UPDATE download_tasks SET status = 'invalid' WHERE task_id IN (${placeholders}) AND status = 'completed'`;
      
      db.run(query, task_ids, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // Get task by ID
  static async getTask(task_id) {
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
              row.is_playlist = Boolean(row.is_playlist);
            }
            resolve(row);
          }
        }
      );
    });
  }

  // Get tasks by user ID with filtering options
  static async getTasksByUid(params = {}) {
    return new Promise((resolve, reject) => {
      const {
        uid,
        platform,
        media_type,
        status,
        page_info = { limit: 100, offset: 0 }
      } = params;

      let query = 'SELECT * FROM download_tasks WHERE user_id = ?';
      let queryParams = [uid];

      // Add filters
      if (platform) {
        query += ' AND platform_name = ?';
        queryParams.push(platform);
      }

      if (media_type) {
        query += ' AND media_type = ?';
        queryParams.push(media_type);
      }

      if (status) {
        query += ' AND status = ?';
        queryParams.push(status);
      }

      // Add ordering and pagination
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      queryParams.push(page_info.limit, page_info.offset);

      db.all(query, queryParams, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const tasks = rows.map(row => ({
            ...row,
            media_info: row.media_info ? JSON.parse(row.media_info) : null,
            result: row.result ? JSON.parse(row.result) : null,
            is_playlist: Boolean(row.is_playlist)
          }));
          resolve(tasks);
        }
      });
    });
  }

  // Get pending tasks for worker processing
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
              result: row.result ? JSON.parse(row.result) : null,
              is_playlist: Boolean(row.is_playlist)
            }));
            resolve(tasks);
          }
        }
      );
    });
  }

  // Get processing tasks (for monitoring)
  static async getProcessingTasks() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM download_tasks 
         WHERE status = 'processing' 
         ORDER BY created_at ASC`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const tasks = rows.map(row => ({
              ...row,
              media_info: row.media_info ? JSON.parse(row.media_info) : null,
              result: row.result ? JSON.parse(row.result) : null,
              is_playlist: Boolean(row.is_playlist)
            }));
            resolve(tasks);
          }
        }
      );
    });
  }

  // Update task status with optional progress, result, and error
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

  // Delete task (with user verification)
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

  // Get task statistics for a user
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
              failed: 0,
              invalid: 0
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

  // Get global statistics (for admin/monitoring)
  static async getGlobalStats() {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT 
           status,
           COUNT(*) as count,
           platform_name,
           media_type
         FROM download_tasks 
         GROUP BY status, platform_name, media_type`,
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const stats = {
              byStatus: {},
              byPlatform: {},
              byMediaType: {},
              total: 0
            };

            rows.forEach(row => {
              // By status
              if (!stats.byStatus[row.status]) {
                stats.byStatus[row.status] = 0;
              }
              stats.byStatus[row.status] += row.count;

              // By platform
              if (!stats.byPlatform[row.platform_name]) {
                stats.byPlatform[row.platform_name] = 0;
              }
              stats.byPlatform[row.platform_name] += row.count;

              // By media type
              if (!stats.byMediaType[row.media_type]) {
                stats.byMediaType[row.media_type] = 0;
              }
              stats.byMediaType[row.media_type] += row.count;

              stats.total += row.count;
            });

            resolve(stats);
          }
        }
      );
    });
  }

  // Clean up old completed/failed tasks (for maintenance)
  static async cleanupOldTasks(olderThanDays = 30) {
    return new Promise((resolve, reject) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
      
      db.run(
        `DELETE FROM download_tasks 
         WHERE status IN ('completed', 'failed', 'invalid') 
         AND created_at < ?`,
        [cutoffDate.toISOString()],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ deletedCount: this.changes });
          }
        }
      );
    });
  }
}

// Database operations for user cookies
export class UserCookiesDB {
  // Save or update user cookies for a platform
  static async saveCookies(user_id, platform_name, cookies_data) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO user_cookies (user_id, platform_name, cookies_data)
        VALUES (?, ?, ?)
      `);

      stmt.run([user_id, platform_name, cookies_data], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            user_id,
            platform_name,
            cookies_data
          });
        }
      });

      stmt.finalize();
    });
  }

  // Get user cookies for a platform
  static async getCookies(user_id, platform_name) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM user_cookies WHERE user_id = ? AND platform_name = ?',
        [user_id, platform_name],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  // Get all cookies for a user
  static async getUserCookies(user_id) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM user_cookies WHERE user_id = ? ORDER BY platform_name',
        [user_id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  // Delete cookies for a platform
  static async deleteCookies(user_id, platform_name) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM user_cookies WHERE user_id = ? AND platform_name = ?',
        [user_id, platform_name],
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
}

export default db;