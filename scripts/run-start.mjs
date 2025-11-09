import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const child = spawn(process.execPath, [path.join(rootDir, "dist", "index.js")], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "production" },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
