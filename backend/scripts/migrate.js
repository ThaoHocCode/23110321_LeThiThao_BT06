import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlDir = path.join(__dirname, "..", "sql");

const files = ["schema.sql", "auth_migration.sql", "orders_cart.sql"];

const ignorableCodes = new Set([
  "ER_DUP_FIELDNAME",
  "ER_TABLE_EXISTS_ERROR",
  "ER_DUP_ENTRY",
]);

const run = async () => {
  const config = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  };

  console.log(`Connecting to MySQL ${config.user}@${config.host}:${config.port}...`);

  const conn = await mysql.createConnection(config);

  for (const file of files) {
    const filePath = path.join(sqlDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`Skip missing file: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(filePath, "utf8");
    try {
      await conn.query(sql);
      console.log(`OK: ${file}`);
    } catch (err) {
      if (ignorableCodes.has(err.code)) {
        console.log(`Skip (already applied): ${file} - ${err.message}`);
      } else {
        console.error(`FAIL: ${file}`);
        console.error(err.message);
        process.exitCode = 1;
      }
    }
  }

  await conn.end();
  console.log("\nMigration done. Restart backend: npm run dev");
};

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
