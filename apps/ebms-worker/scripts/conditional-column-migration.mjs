import { execSync } from "node:child_process";

function run(cmd, useInherit = false) {
  return execSync(cmd, {
    encoding: "utf8",
    stdio: useInherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });
}

const [, , dbName, scope, table, column, migrationFile] = process.argv;
if (!dbName || !scope || !table || !column || !migrationFile) {
  console.error(
    "Usage: node conditional-column-migration.mjs <dbName> <--local|--remote> <table> <column> <migrationFile>",
  );
  process.exit(1);
}

const pragmaCmd = `wrangler d1 execute ${dbName} ${scope} --command "PRAGMA table_info(${table});"`;
const pragmaOutput = run(pragmaCmd, false);
const hasColumn =
  pragmaOutput.includes(`"name": "${column}"`) ||
  pragmaOutput.includes(`"name":"${column}"`);

if (hasColumn) {
  console.log(
    `Skipping ${migrationFile}: column '${column}' already exists on '${table}'.`,
  );
  process.exit(0);
}

const migrateCmd = `wrangler d1 execute ${dbName} ${scope} --file=${migrationFile}`;
run(migrateCmd, true);
