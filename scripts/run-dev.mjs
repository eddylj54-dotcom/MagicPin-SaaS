import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const viteCli = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");

const child = spawn(
  process.execPath,
  [viteCli, "--clearScreen", "false", "--host"],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "development" },
  },
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
