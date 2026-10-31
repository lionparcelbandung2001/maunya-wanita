document.addEventListener("DOMContentLoaded", function () {
  // 1. Pastikan data artikel tersedia
  if (
    typeof artikelData === "undefined" ||
    !Array.isArray(artikelData) ||
    artikelData.length === 0
  ) {
    return;
  }

  // 2. Ambil nama file artikel saat ini
  const currentFileName = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  // 3. Validasi dan amankan data artikel
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  const artikelValid = artikelData.filter(function (item) {
    return (
      item &&
      typeof item.link === "string" &&
      typeof item.judul === "string" &&
      item.link.trim() !== "" &&
      item.judul.trim() !== ""
    );
  });

  const artikelLain = artikelValid.filter(function (item) {
    const namaFile = item.link.split("/").pop().toLowerCase();
    return namaFile !== currentFileName;
  });

  // Tidak ada artikel lain yang bisa dituju
  if (artikelLain.length === 0) return;

  // 4. Acak urutan artikel
  function acakArtikel(daftar) {
    const hasil = [...daftar];

    for (let i = hasil.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
    }

    return hasil;
  }

  // Pilih dua artikel acak yang berbeda jika tersedia
  const pilihanPanah = acakArtikel(artikelLain);
  const artikelKiri = pilihanPanah[0];
  const artikelKanan =
    pilihanPanah.length > 1
      ? pilihanPanah[1]
      : pilihanPanah[0];

  // 5. Buat navigasi panah di dekat top bar
  if (!document.getElementById("artikel-panah-navigasi")) {
    const navigasi = document.createElement("nav");
    navigasi.id = "artikel-panah-navigasi";
    navigasi.setAttribute("aria-label", "Navigasi artikel");

    navigasi.innerHTML = `
      <a class="panah-artikel panah-kiri"
         href="${escapeHTML(artikelKiri.link)}"
         aria-label="Baca artikel acak lainnya: ${escapeHTML(artikelKiri.judul)}">
        <span class="panah-simbol" aria-hidden="true">←</span>
        <span class="panah-info">
          <span class="panah-label">BACA ARTIKEL</span>
          <span class="panah-judul">${escapeHTML(artikelKiri.judul)}</span>
        </span>
      </a>

      <a class="panah-artikel panah-kanan"
         href="${escapeHTML(artikelKanan.link)}"
         aria-label="Baca artikel acak lainnya: ${escapeHTML(artikelKanan.judul)}">
        <span class="panah-info">
          <span class="panah-label">ARTIKEL LAINNYA</span>
          <span class="panah-judul">${escapeHTML(artikelKanan.judul)}</span>
        </span>
        <span class="panah-simbol" aria-hidden="true">→</span>
      </a>
    `;

    // 6. Tambahkan desain navigasi
    if (!document.getElementById("artikel-panah-style")) {
      const style = document.createElement("style");
      style.id = "artikel-panah-style";

      style.textContent = `
        #artikel-panah-navigasi {
          box-sizing: border-box;
          width: calc(100% - 24px);
          max-width: 1050px;
          margin: 12px auto 18px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 12px;
          font-family: inherit;
        }

        #artikel-panah-navigasi *,
        #artikel-panah-navigasi *::before,
        #artikel-panah-navigasi *::after {
          box-sizing: border-box;
        }

        #artikel-panah-navigasi .panah-artikel {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
          min-height: 66px;
          padding: 10px 12px;
          border: 1px solid #f0c4da;
          border-radius: 14px;
          background: linear-gradient(135deg, #fffafd, #ffedf5);
          color: #a83270;
          text-decoration: none;
          box-shadow: 0 3px 12px rgba(190, 80, 130, .07);
          transition: background .2s, transform .2s;
        }

        #artikel-panah-navigasi .panah-artikel:hover {
          background: #ffe1ee;
          transform: translateY(-2px);
        }

        #artikel-panah-navigasi .panah-kiri {
          justify-content: flex-start;
          text-align: left;
        }

        #artikel-panah-navigasi .panah-kanan {
          justify-content: flex-end;
          text-align: right;
        }

        #artikel-panah-navigasi .panah-simbol {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 34px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #d65b99;
          color: white;
          font-size: 23px;
          line-height: 1;
        }

        #artikel-panah-navigasi .panah-info {
          display: block;
          flex: 1;
          min-width: 0;
        }

        #artikel-panah-navigasi .panah-label {
          display: block;
          margin-bottom: 4px;
          color: #b83d7c;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .3px;
        }

        #artikel-panah-navigasi .panah-judul {
          display: -webkit-box;
          overflow: hidden;
          overflow-wrap: anywhere;
          color: #623b53;
          font-size: 12px;
          font-weight: 650;
          line-height: 1.4;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        @media (max-width: 480px) {
          #artikel-panah-navigasi {
            width: calc(100% - 20px);
            gap: 7px;
            margin: 9px auto 14px;
          }

          #artikel-panah-navigasi .panah-artikel {
            gap: 6px;
            min-height: 58px;
            padding: 8px 7px;
            border-radius: 11px;
          }

          #artikel-panah-navigasi .panah-simbol {
            flex-basis: 27px;
            width: 27px;
            height: 27px;
            font-size: 19px;
          }

          #artikel-panah-navigasi .panah-label {
            font-size: 9px;
          }

          #artikel-panah-navigasi .panah-judul {
            font-size: 11px;
          }
        }
      `;

      document.head.appendChild(style);
    }

    // Prioritaskan lokasi tepat di bawah header/top bar.
    // Jika tidak ada header, letakkan sebelum isi artikel.
    const topBar =
      document.querySelector(".site-header") ||
      document.querySelector(".topbar") ||
      document.querySelector(".navbar") ||
      document.querySelector("header nav") ||
      document.querySelector("header");

    const articleContent =
      document.querySelector("article") ||
      document.querySelector("main") ||
      document.querySelector(".container");

    if (topBar && topBar.parentNode) {
      topBar.insertAdjacentElement("afterend", navigasi);
    } else if (articleContent && articleContent.parentNode) {
      articleContent.parentNode.insertBefore(
        navigasi,
        articleContent
      );
    } else {
      document.body.insertBefore(
        navigasi,
        document.body.firstChild
      );
    }
  }

  // 7. Rekomendasi artikel lama: maksimal 3 artikel acak
  const rekomendasi = acakArtikel(artikelLain).slice(0, 3);

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

  // 8. Pertahankan desain rekomendasi artikel
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
        box-shadow: 0 5px 18px rgba(190, 80, 130, .08);
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
        transition: background .2s, transform .2s;
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

  // 9. Masukkan rekomendasi setelah isi artikel
  const target =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.querySelector(".container");

  if (target) {
    target.appendChild(relatedBox);
  }
});
