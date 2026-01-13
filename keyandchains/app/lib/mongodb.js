// app/utils/mongodb.js
import mongoose from "mongoose";

const DEFAULT_DB = "dashboard";

// Global cache (works across hot reloads in dev)
if (!global.__mongo_cache__) {
  global.__mongo_cache__ = {
    conn: null,
    promise: null,
  };
}

function getEnvVar(name) {
  return process.env[name];
}

// Returns the mongoose module object
export default async function connectToDatabase(opts = {}) {
  const MONGODB_URI =
    process.env.MONGODB_URI ?? getEnvVar("MONGODB_URI");
  const DB_NAME =
    process.env.DB_NAME ?? getEnvVar("DB_NAME") ?? DEFAULT_DB;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define MONGODB_URI in your environment variables (e.g. .env.local)."
    );
  }

  // Already connected
  if (global.__mongo_cache__.conn) {
    return global.__mongo_cache__.conn;
  }

  // Connection in progress
  if (global.__mongo_cache__.promise) {
    return global.__mongo_cache__.promise;
  }

  const retries = opts.retries ?? 3;
  const retryDelayMs = opts.retryDelayMs ?? 1000;

  const connectWithRetry = async () => {
    const connectOptions = {
      dbName: DB_NAME,
    };

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[mongo] connecting to (db: ${DB_NAME}) attempt ${attempt}`);
        const conn = await mongoose.connect(MONGODB_URI, connectOptions);

        global.__mongo_cache__.conn = conn;
        global.__mongo_cache__.promise = null;

        console.log("[mongo] connected");
        return conn;
      } catch (err) {
        console.error(
          `[mongo] connection attempt ${attempt} failed:`,
          err?.message || err
        );

        global.__mongo_cache__.promise = null;

        if (attempt === retries) {
          const e = new Error(
            `Failed to connect to MongoDB after ${retries} attempts. Last error: ${
              err?.message || err
            }`
          );
          e.cause = err;
          throw e;
        }

        await new Promise((res) =>
          setTimeout(res, retryDelayMs * attempt)
        );
      }
    }

    throw new Error("Unexpected MongoDB connection error");
  };

  global.__mongo_cache__.promise = connectWithRetry();
  return global.__mongo_cache__.promise;
}
