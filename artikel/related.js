document.addEventListener("DOMContentLoaded", function () {
  // 1. Pastikan data artikel tersedia
  if (
    typeof artikelData === "undefined" ||
    !Array.isArray(artikelData) ||
    artikelData.length === 0
  ) {
    return;
  }

  // 2. Ambil nama file halaman yang sedang dibuka
  const currentFileName = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  // 3. Saring artikel yang valid dan bukan artikel saat ini
  const artikelLain = artikelData.filter(function (item) {
    if (!item.link || !item.judul) return false;

    const namaFileArtikel = item.link
      .split("/")
      .pop()
      .toLowerCase();

    return namaFileArtikel !== currentFileName;
  });

  if (artikelLain.length === 0) return;

  // 4. Acak artikel dan ambil maksimal 3
  const rekomendasi = [...artikelLain]
    .sort(function () {
      return Math.random() - 0.5;
    })
    .slice(0, 3);

  // 5. Buat kotak rekomendasi
  const relatedBox = document.createElement("section");
  relatedBox.className = "artikel-terkait-wrapper";

  relatedBox.innerHTML = `
    <div class="artikel-terkait-box">
      <h3 class="artikel-terkait-title">
        💗 Artikel Pilihan untuk Kamu
      </h3>

      <p class="artikel-terkait-desc">
        Temukan bacaan menarik lainnya di CewekPedia.
      </p>

      <div class="artikel-terkait-list">
        ${rekomendasi.map(function (item) {
          return `
            <a class="artikel-terkait-item"
               href="${escapeHTML(item.link)}">
              <span class="artikel-terkait-icon">♡</span>
              <span class="artikel-terkait-text">
                ${escapeHTML(item.judul)}
              </span>
              <span class="artikel-terkait-arrow">›</span>
            </a>
          `;
        }).join("")}
      </div>

      <a class="artikel-terkait-more" href="/artikel/">
        Lihat Semua Artikel →
      </a>
    </div>
  `;

  // 6. Tambahkan CSS dengan warna khas CewekPedia
  if (!document.getElementById("related-style")) {
    const style = document.createElement("style");
    style.id = "related-style";

    style.textContent = `
      .artikel-terkait-wrapper {
        width: 100%;
        box-sizing: border-box;
        margin: 30px 0;
        font-family: inherit;
      }

      .artikel-terkait-box {
        box-sizing: border-box;
        padding: 20px;
        background: linear-gradient(135deg, #fff7fb, #fff0f6);
        border: 1px solid #f8d5e5;
        border-radius: 18px;
        box-shadow: 0 5px 18px rgba(190, 80, 130, 0.08);
      }

      .artikel-terkait-title {
        margin: 0 0 8px;
        color: #a83270;
        font-size: 19px;
        line-height: 1.5;
      }

      .artikel-terkait-desc {
        margin: 0 0 16px;
        color: #806879;
        font-size: 14px;
        line-height: 1.6;
      }

      .artikel-terkait-list {
        display: grid;
        gap: 10px;
      }

      .artikel-terkait-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 13px;
        color: #623b53;
        text-decoration: none;
        background: #ffffff;
        border: 1px solid #f7dfeb;
        border-radius: 12px;
        transition: background 0.2s, transform 0.2s;
      }

      .artikel-terkait-item:hover {
        background: #ffe8f2;
        transform: translateY(-2px);
      }

      .artikel-terkait-icon {
        flex-shrink: 0;
        color: #d65b99;
        font-size: 22px;
      }

      .artikel-terkait-text {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      .artikel-terkait-arrow {
        flex-shrink: 0;
        color: #c05b91;
        font-size: 24px;
      }

      .artikel-terkait-more {
        display: inline-block;
        margin-top: 16px;
        padding: 10px 15px;
        color: #ffffff;
        background: #d65b99;
        border-radius: 20px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 700;
      }

      .artikel-terkait-more:hover {
        background: #b83d7c;
      }

      @media (max-width: 480px) {
        .artikel-terkait-box {
          padding: 15px;
          border-radius: 14px;
        }

        .artikel-terkait-title {
          font-size: 17px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // 7. Masukkan rekomendasi setelah isi artikel
  const target =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.querySelector(".container");

  if (target) {
    target.appendChild(relatedBox);
  }

  // 8. Amankan teks dari karakter HTML
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }
});
