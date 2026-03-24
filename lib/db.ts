import { neon } from "@neondatabase/serverless";
import type { NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

function getDb(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    _sql = neon(url);
  }
  return _sql;
}

// Proxy that lazily initializes the connection
const sql = new Proxy({} as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args) {
    const db = getDb();
    // @ts-expect-error – forwarding tagged template call
    return db(...args);
  },
  get(_target, prop) {
    const db = getDb();
    // @ts-expect-error – forwarding property access
    return db[prop];
  },
});

export default sql;
