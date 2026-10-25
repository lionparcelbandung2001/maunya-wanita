const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const BASE_URL = "https://cewekpedia.com";
const ROOT_DIR = __dirname;
const OUTPUT_FILE = path.join(ROOT_DIR, "sitemap.xml");

// Halaman utama dan halaman informasi yang boleh masuk sitemap.
const ALLOWED_ROOT_PAGES = new Set([
  "index.html",
  "tentang.html",
  "saran.html",
  "privacy.html",
  "kontak.html"
]);

// Hanya bagian artikel yang dipindai secara otomatis.
const ARTICLE_DIR = "artikel";

// File artikel yang bukan halaman publik.
const EXCLUDED_FILES = new Set([
  "template.html",
  "music-player.html",
  "shell.html",
  "home.html",
  "katalog.html"
]);

// Halaman formulir tidak dimasukkan.
function isFormPage(fileName) {
  return fileName.startsWith("kirim") &&
         fileName.endsWith(".html");
}

// Halaman detail dinamis tidak dimasukkan sebagai URL kosong.
function isDynamicDetailPage(fileName) {
  return fileName.endsWith("-detail.html");
}

// Folder teknis dan aset yang tidak perlu dipindai.
const EXCLUDED_DIRS = new Set([
  ".git",
  ".github",
  "node_modules",
  "images",
  "data"
]);

// Mencari file HTML di folder artikel.
function findHtmlFiles(dir) {
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

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

// Mengambil tanggal commit terakhir dari Git.
function getLastModified(filePath) {
  try {
    const relativePath = path
      .relative(ROOT_DIR, filePath)
      .split(path.sep)
      .join("/");

    const date = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      {
        cwd: ROOT_DIR,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"]
      }
    ).trim();

    return date || null;
  } catch {
    return null;
  }
}

// Mengubah lokasi file menjadi URL website.
function fileToUrl(filePath) {
  const relative = path
    .relative(ROOT_DIR, filePath)
    .split(path.sep)
    .join("/");

  if (relative === "index.html") {
    return `${BASE_URL}/`;
  }

  if (relative.endsWith("/index.html")) {
    const folder = relative.slice(
      0,
      -"/index.html".length
    );

    return `${BASE_URL}/${folder}/`;
  }

  return `${BASE_URL}/${relative}`;
}

// Escape karakter khusus XML.
function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Mengambil halaman root yang diizinkan.
const rootFiles = [];

for (const fileName of ALLOWED_ROOT_PAGES) {
  const filePath = path.join(ROOT_DIR, fileName);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    rootFiles.push(filePath);
  }
}

// Mengambil artikel secara otomatis.
const articlePath = path.join(ROOT_DIR, ARTICLE_DIR);
const articleFiles = findHtmlFiles(articlePath);

// Gabungkan file yang boleh diproses.
const candidateFiles = [
  ...rootFiles,
  ...articleFiles
];

const urls = [];

for (const filePath of candidateFiles) {
  const fileName = path.basename(filePath).toLowerCase();

  if (EXCLUDED_FILES.has(fileName)) {
    continue;
  }

  if (isFormPage(fileName)) {
    continue;
  }

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

// Hilangkan URL duplikat dan urutkan.
const uniqueUrls = Array.from(
  new Map(urls.map(item => [item.url, item])).values()
).sort((a, b) => a.url.localeCompare(b.url));

// Membuat XML sitemap.
let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const item of uniqueUrls) {
  sitemap += "  <url>\n";
  sitemap += `    <loc>${escapeXml(item.url)}</loc>\n`;

  if (item.lastModified) {
    sitemap += `    <lastmod>${escapeXml(item.lastModified)}</lastmod>\n`;
  }

  sitemap += "  </url>\n";
}

sitemap += "</urlset>\n";

// Simpan sitemap.xml.
fs.writeFileSync(OUTPUT_FILE, sitemap, "utf8");

console.log("=================================");
console.log("Sitemap CewekPedia berhasil dibuat.");
console.log(`Jumlah URL: ${uniqueUrls.length}`);
console.log("File: sitemap.xml");
console.log("Domain: " + BASE_URL);
console.log("=================================");
