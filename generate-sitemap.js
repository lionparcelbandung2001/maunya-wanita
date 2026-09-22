const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BASE_URL = "https://cewekpedia.com";

const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(ROOT_DIR, "sitemap.xml");

// File yang tidak dimasukkan ke sitemap
const EXCLUDED_FILES = new Set([
  "home.html",
  "shell.html",
  "music-player.html",
  "katalog.html"
]);

// Halaman formulir tidak dimasukkan ke sitemap
function isFormPage(fileName) {
  return fileName.startsWith("kirim") && fileName.endsWith(".html");
}

// Template detail Firebase tidak dimasukkan sebagai URL kosong.
// URL detail sebenarnya menggunakan ?id=...
function isDynamicDetailPage(fileName) {
  return fileName.endsWith("-detail.html");
}

// Folder teknis/data yang tidak perlu dipindai
const EXCLUDED_DIRS = new Set([
  ".git",
  ".github",
  "node_modules",
  "images",
  "data"
]);

// Mencari semua file HTML secara otomatis
function findHtmlFiles(dir) {
  const results = [];

  const entries = fs.readdirSync(dir, {
    withFileTypes: true
  });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        results.push(...findHtmlFiles(fullPath));
      }

      continue;
    }

    if (
      entry.isFile() &&
      entry.name.toLowerCase().endsWith(".html")
    ) {
      results.push(fullPath);
    }
  }

  return results;
}

// Mengambil tanggal commit terakhir dari Git
function getLastModified(filePath) {
  try {
    const relativePath = path.relative(ROOT_DIR, filePath);

    const date = execSync(
      `git log -1 --format=%cI -- "${relativePath}"`,
      {
        cwd: ROOT_DIR,
        encoding: "utf8"
      }
    ).trim();

    return date || null;
  } catch {
    return null;
  }
}

// Mengubah lokasi file menjadi URL website
function fileToUrl(filePath) {
  let relative = path.relative(ROOT_DIR, filePath);

  relative = relative.split(path.sep).join("/");

  // Homepage
  if (relative === "index.html") {
    return `${BASE_URL}/`;
  }

  // index.html di dalam folder
  if (relative.endsWith("/index.html")) {
    const folder = relative.slice(0, -"/index.html".length);

    return `${BASE_URL}/${folder}/`;
  }

  // HTML biasa
  return `${BASE_URL}/${relative}`;
}

// Escape karakter khusus XML
function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Cari semua HTML
const htmlFiles = findHtmlFiles(ROOT_DIR);

const urls = [];

for (const filePath of htmlFiles) {
  const fileName = path.basename(filePath).toLowerCase();

  // File yang dikecualikan
  if (EXCLUDED_FILES.has(fileName)) {
    continue;
  }

  // Halaman kirim/form
  if (isFormPage(fileName)) {
    continue;
  }

  // Template detail Firebase
  if (isDynamicDetailPage(fileName)) {
    continue;
  }

  const url = fileToUrl(filePath);
  const lastModified = getLastModified(filePath);

  urls.push({
    url,
    lastModified
  });
}

// Hilangkan URL duplikat
const uniqueUrls = Array.from(
  new Map(urls.map(item => [item.url, item])).values()
);

// Urutkan URL agar sitemap stabil
uniqueUrls.sort((a, b) => a.url.localeCompare(b.url));

// Membuat XML sitemap
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

for (const item of uniqueUrls) {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${escapeXml(item.url)}</loc>\n`;

  if (item.lastModified) {
    sitemap += `    <lastmod>${escapeXml(item.lastModified)}</lastmod>\n`;
  }

  sitemap += `  </url>\n`;
}

sitemap += `</urlset>\n`;

// Menulis sitemap.xml
fs.writeFileSync(OUTPUT_FILE, sitemap, "utf8");

console.log("=================================");
console.log("Sitemap berhasil dibuat.");
console.log(`Jumlah URL: ${uniqueUrls.length}`);
console.log("File: sitemap.xml");
console.log("=================================");
