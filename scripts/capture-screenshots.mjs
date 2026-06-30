/**
 * Capture Chrome Web Store screenshots (1280x800) and a popup preview.
 *
 * Renders the built extension over a local static server with a minimal
 * `chrome.*` stub injected, so the reader runs as a normal page.
 *
 * Usage:
 *   yarn build:full
 *   SAMPLE_EPUB=/path/to/book.epub yarn screenshots
 *
 * Output: docs/screenshots/{01-upload,02-reading,03-popup}.png
 */
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUILD = path.join(ROOT, "build");
const OUT = path.join(ROOT, "docs", "screenshots");
const EPUB = process.env.SAMPLE_EPUB;
const PORT = 8099;
const VW = 1280;
const VH = 800;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json",
};

function serve(dir, port) {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(dir, urlPath === "/" ? "/index.html" : urlPath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
      });
      res.end(data);
    });
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

const CHROME_STUB = () => {
  window.chrome = {
    runtime: {
      sendMessage: (...args) => {
        const cb = args.find((a) => typeof a === "function");
        if (cb) {
          try {
            cb({});
          } catch (e) {}
        }
        return Promise.resolve({});
      },
      onMessage: { addListener() {}, removeListener() {} },
      getURL: (p) => p,
      lastError: null,
      id: "stub",
    },
  };
};

const base = `http://localhost:${PORT}`;
fs.mkdirSync(OUT, { recursive: true });

const server = await serve(BUILD, PORT);
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: VW, height: VH } });
await context.addInitScript(CHROME_STUB);

// 1) Reader landing / upload screen
const page = await context.newPage();
await page.goto(`${base}/reader.html`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: path.join(OUT, "01-upload.png") });
console.log("captured 01-upload.png");

// 2) Reading view (requires a sample EPUB)
if (EPUB && fs.existsSync(EPUB)) {
  await page.locator('input[type="file"]').setInputFiles(EPUB);
  await page.waitForFunction(() => !document.querySelector('input[type="file"]'), {
    timeout: 20000,
  });
  await page.waitForTimeout(2500);
  const chapter = page.getByText(/CHAPTER/i).first();
  if (await chapter.count()) await chapter.click();
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(OUT, "02-reading.png") });
  console.log("captured 02-reading.png");
} else {
  console.log("skipped 02-reading.png (set SAMPLE_EPUB to a .epub path)");
}

// 3) Popup
const popup = await context.newPage();
await popup.setViewportSize({ width: 280, height: 210 });
await popup.goto(`${base}/index.html`, { waitUntil: "networkidle" });
await popup.waitForTimeout(800);
await popup.screenshot({ path: path.join(OUT, "03-popup.png") });
console.log("captured 03-popup.png");

await browser.close();
server.close();
console.log("done");
