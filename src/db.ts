import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
};

let db: Database | null = null;

async function openDb(): Promise<Database> {
  if (!db) {
    const dbPath = path.join(process.cwd(), "public", "db.sqlite");
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE
      );
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        authorId INTEGER,
        FOREIGN KEY (authorId) REFERENCES users(id)
      );
    `);
  }
  return db;
}

export const data = {
  getUsers: async (): Promise<User[]> => {
    const db = await openDb();
    return db.all<User[]>("SELECT * FROM users");
  },

  getUserById: async (id: number): Promise<User | undefined> => {
    const db = await openDb();
    return db.get<User>("SELECT * FROM users WHERE id = ?", id);
  },

  getPosts: async (): Promise<Post[]> => {
    const db = await openDb();
    return db.all<Post[]>("SELECT * FROM posts");
  },

  getPostById: async (id: number): Promise<Post | undefined> => {
    const db = await openDb();
    return db.get<Post>("SELECT * FROM posts WHERE id = ?", id);
  },

  createUser: async (user: Omit<User, "id">): Promise<User> => {
    const db = await openDb();
    try {
      const result = await db.run(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        user.name,
        user.email
      );
      return { ...user, id: result.lastID! };
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed: users.email")
      ) {
        throw new Error("Email already exists");
      }
      throw error;
    }
  },

  createPost: async (post: Omit<Post, "id">): Promise<Post> => {
    const db = await openDb();
    const result = await db.run(
      "INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)",
      post.title,
      post.content,
      post.authorId
    );
    return { ...post, id: result.lastID! };
  },

  updateUser: async (
    id: number,
    updates: Partial<User>
  ): Promise<User | undefined> => {
    const db = await openDb();
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    try {
      await db.run(`UPDATE users SET ${setClause} WHERE id = ?`, ...values, id);
      return data.getUserById(id);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed: users.email")
      ) {
        throw new Error("Email already exists");
      }
      throw error;
    }
  },

  updatePost: async (
    id: number,
    updates: Partial<Post>
  ): Promise<Post | undefined> => {
    const db = await openDb();
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    await db.run(`UPDATE posts SET ${setClause} WHERE id = ?`, ...values, id);
    return data.getPostById(id);
  },

  deleteUser: async (id: number): Promise<boolean> => {
    const db = await openDb();
    const result = await db.run("DELETE FROM users WHERE id = ?", id);
    return result.changes ? result.changes > 0 : false;
  },

  deletePost: async (id: number): Promise<boolean> => {
    const db = await openDb();
    const result = await db.run("DELETE FROM posts WHERE id = ?", id);
    return result.changes ? result.changes > 0 : false;
  },
};
