import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packageRoot = join(root, "node_modules", "@matbee", "libreoffice-converter");

const files = [
  {
    from: join(packageRoot, "dist", "browser.worker.global.js"),
    to: join(root, "public", "libreoffice", "browser.worker.global.js"),
  },
  ...["soffice.js", "soffice.wasm", "soffice.data", "soffice.worker.js"].map((fileName) => ({
    from: join(packageRoot, "wasm", fileName),
    to: join(root, "public", "wasm", fileName),
  })),
];

files.forEach(({ from, to }) => {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
});

console.log("LibreOffice browser assets prepared in public/wasm and public/libreoffice.");
