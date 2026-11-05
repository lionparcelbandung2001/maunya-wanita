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
  const currentFileName = decodeURIComponent(
    window.location.pathname.split("/").pop()
  ).toLowerCase();

  // 3. Amankan teks HTML
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

  // 4. Validasi data artikel
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
    const namaFile = decodeURIComponent(
      item.link.split("/").pop()
    ).toLowerCase();

    return namaFile !== currentFileName;
  });

  if (artikelLain.length === 0) return;

  // 5. Acak artikel
  function acakArtikel(daftar) {
    const hasil = [...daftar];

    for (let i = hasil.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
    }

    return hasil;
  }

  const pilihanPanah = acakArtikel(artikelLain);
  const artikelKiri = pilihanPanah[0];
  const artikelKanan =
    pilihanPanah.length > 1
      ? pilihanPanah[1]
      : pilihanPanah[0];

  // 6. Buat navigasi panah
  if (!document.getElementById("artikel-panah-navigasi")) {
    const navigasi = document.createElement("nav");
    navigasi.id = "artikel-panah-navigasi";
    navigasi.setAttribute("aria-label", "التنقل بين المقالات");
    navigasi.setAttribute("dir", "rtl");

    navigasi.innerHTML = `
      <a class="panah-artikel panah-kiri"
         href="${escapeHTML(artikelKiri.link)}"
         aria-label="اقرأ مقالاً آخر: ${escapeHTML(artikelKiri.judul)}">
        <span class="panah-simbol" aria-hidden="true">→</span>
        <span class="panah-info">
          <span class="panah-label">اقرأ مقالاً آخر</span>
          <span class="panah-judul">${escapeHTML(artikelKiri.judul)}</span>
        </span>
      </a>

      <a class="panah-artikel panah-kanan"
         href="${escapeHTML(artikelKanan.link)}"
         aria-label="مقالات أخرى: ${escapeHTML(artikelKanan.judul)}">
        <span class="panah-info">
          <span class="panah-label">مقالات أخرى</span>
          <span class="panah-judul">${escapeHTML(artikelKanan.judul)}</span>
        </span>
        <span class="panah-simbol" aria-hidden="true">←</span>
      </a>
    `;

    // 7. Desain navigasi panah
    if (!document.getElementById("artikel-panah-style")) {
      const style = document.createElement("style");
      style.id = "artikel-panah-style";

      style.textContent = `
        #artikel-panah-navigasi {
          box-sizing: border-box;
          position: fixed;
          top: 8px;
          left: 0;
          right: 0;
          z-index: 999;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 12px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          pointer-events: none;
          font-family: inherit;
          direction: rtl;
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
          width: 46%;
          max-width: 300px;
          min-width: 0;
          min-height: 66px;
          padding: 10px 12px;
          border: 1px solid #f0c4da;
          border-radius: 14px;
          background: linear-gradient(135deg, #fffafd, #ffedf5);
          color: #a83270;
          text-decoration: none;
          box-shadow: 0 3px 12px rgba(190, 80, 130, .12);
          transition: background .2s, opacity .2s;
          pointer-events: auto;
          direction: rtl;
        }

        #artikel-panah-navigasi .panah-artikel:hover {
          background: #ffe1ee;
        }

        #artikel-panah-navigasi .panah-kiri {
          justify-content: flex-start;
          text-align: right;
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
        }

        #artikel-panah-navigasi .panah-judul {
          display: -webkit-box;
          overflow: hidden;
          overflow-wrap: anywhere;
          color: #623b53;
          font-size: 12px;
          font-weight: 650;
          line-height: 1.6;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        @media (max-width: 480px) {
          #artikel-panah-navigasi {
            top: 6px;
            padding: 0 5px;
            gap: 6px;
          }

          #artikel-panah-navigasi .panah-artikel {
            gap: 5px;
            width: 48%;
            min-height: 52px;
            padding: 7px 6px;
            border-radius: 11px;
          }

          #artikel-panah-navigasi .panah-simbol {
            flex-basis: 25px;
            width: 25px;
            height: 25px;
            font-size: 18px;
          }

          #artikel-panah-navigasi .panah-label {
            font-size: 8px;
          }

          #artikel-panah-navigasi .panah-judul {
            font-size: 10px;
          }
        }
      `;

      document.head.appendChild(style);
    }

    // Masukkan navigasi ke halaman
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

  // 8. Rekomendasi maksimal 3 artikel acak
  const rekomendasi = acakArtikel(artikelLain).slice(0, 3);

  const relatedBox = document.createElement("section");
  relatedBox.className = "artikel-terkait-wrapper";
  relatedBox.setAttribute("dir", "rtl");

  relatedBox.innerHTML = `
    <div class="artikel-terkait-box">
      <h3 class="artikel-terkait-title">
        💗 مقالات مختارة لك
      </h3>

      <p class="artikel-terkait-desc">
        اكتشفي المزيد من المقالات الممتعة على CewekPedia.
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
              <span class="artikel-terkait-arrow">‹</span>
            </a>
          `;
        }).join("")}
      </div>

      <a class="artikel-terkait-more" href="/ar/artikel/">
        عرض جميع المقالات ←
      </a>
    </div>
  `;

  // 9. Desain rekomendasi artikel
  if (!document.getElementById("related-style")) {
    const style = document.createElement("style");
    style.id = "related-style";

    style.textContent = `
      .artikel-terkait-wrapper {
        width: 100%;
        box-sizing: border-box;
        margin: 30px 0;
        font-family: inherit;
        direction: rtl;
        text-align: right;
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
        line-height: 1.7;
      }

      .artikel-terkait-desc {
        margin: 0 0 16px;
        color: #806879;
        font-size: 14px;
        line-height: 1.8;
      }

      .artikel-terkait-list {
        display: grid;
        gap: 10px;
      }

      .artikel-terkait-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        padding: 13px;
        color: #623b53;
        text-decoration: none;
        background: #ffffff;
        border: 1px solid #f7dfeb;
        border-radius: 12px;
        transition: background .2s, transform .2s;
        direction: rtl;
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
        line-height: 1.8;
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

  // 10. Masukkan rekomendasi setelah isi artikel
  const target =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.querySelector(".container");

  if (target) {
    target.appendChild(relatedBox);
  }
});
