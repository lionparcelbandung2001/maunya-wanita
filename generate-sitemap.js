const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BASE_URL = "https://cewekpedia.com";

const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(ROOT_DIR, "sitemap.xml");

// File/template yang tidak perlu masuk sitemap
const EXCLUDED_FILES = new Set([
  "index.html",          // ditangani sebagai homepage /
  "home.html",           // canonical ke /
  "shell.html",          // komponen teknis
  "music-player.html",   // komponen teknis
  "katalog.html"         // template dinamis
]);

// Halaman formulir yang tidak perlu masuk sitemap
function isFormPage(fileName) {
  return fileName.startsWith("kirim") && fileName.endsWith(".html");
}

// Template detail Firebase.
// URL detail sebenarnya menggunakan ?id=...
function isDynamicDetailPage(fileName) {
  return fileName.endsWith("-detail.html");
}

// Folder yang tidak berisi halaman website publik
const EXCLUDED_DIRS = new Set([
  ".git",
  ".github",
  "node_modules",
  "images",
  "data"
]);

// Cari semua file HTML secara rekursif
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

// Ambil tanggal perubahan terakhir dari Git
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

// Ubah path file menjadi URL website
function fileToUrl(filePath) {
  let relative = path.relative(ROOT_DIR, filePath);

  relative = relative.split(path.sep).join("/");

  // index.html di root = homepage
  if (relative === "index.html") {
    return `${BASE_URL}/`;
  }

  // index.html di folder = /folder/
  if (relative.endsWith("/index.html")) {
    const folder = relative.slice(0, -"/index.html".length);
    return `${BASE_URL}/${folder}/`;
  }

  // HTML biasa
  return `${BASE_URL}/${relative}`;
}

// Escape XML
function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Mulai proses
const htmlFiles = findHtmlFiles(ROOT_DIR);

const urls = [];

for (const filePath of htmlFiles) {
  const relative = path.relative(ROOT_DIR, filePath);
  const fileName = path.basename(filePath).toLowerCase();

  // File yang memang dikecualikan
  if (EXCLUDED_FILES.has(fileName)) {
    continue;
  }

  // Halaman formulir
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

// Urutkan URL supaya sitemap stabil
urls.sort((a, b) => a.url.localeCompare(b.url));

// Buat XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n`;

for (const item of urls) {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${escapeXml(item.url)}</loc>\n`;

  if (item.lastModified) {
    sitemap += `    <lastmod>${escapeXml(item.lastModified)}</lastmod>\n`;
  }

  sitemap += `  </url>\n\n`;
}

sitemap += `</urlset>\n`;

// Simpan sitemap.xml
fs.writeFileSync(OUTPUT_FILE, sitemap, "utf8");

console.log(`Sitemap berhasil dibuat.`);
console.log(`Jumlah URL: ${urls.length}`);
console.log(`File: sitemap.xml`);
