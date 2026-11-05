document.addEventListener("DOMContentLoaded", function () {
  // 1. Make sure article data is available
  if (
    typeof artikelData === "undefined" ||
    !Array.isArray(artikelData) ||
    artikelData.length === 0
  ) {
    return;
  }

  // 2. Get the current article path
  const currentPath = window.location.pathname.toLowerCase();

  // 3. Escape HTML to prevent unsafe content
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

  // Allow only safe, same-origin article links
  function safeLink(value) {
    try {
      const url = new URL(value, window.location.origin);

      if (
        (url.protocol === "http:" || url.protocol === "https:") &&
        url.origin === window.location.origin
      ) {
        return url.pathname + url.search + url.hash;
      }
    } catch (error) {
      return "";
    }

    return "";
  }

  // 4. Validate article data
  const validArticles = artikelData
    .filter(function (item) {
      return (
        item &&
        typeof item.link === "string" &&
        typeof item.judul === "string" &&
        item.link.trim() !== "" &&
        item.judul.trim() !== ""
      );
    })
    .map(function (item) {
      return {
        ...item,
        safeLink: safeLink(item.link)
      };
    })
    .filter(function (item) {
      return item.safeLink !== "";
    });

  // Exclude the current article
  const otherArticles = validArticles.filter(function (item) {
    const articlePath = new URL(
      item.safeLink,
      window.location.origin
    ).pathname.toLowerCase();

    return articlePath !== currentPath;
  });

  // Stop if there are no other articles
  if (otherArticles.length === 0) return;

  // 5. Shuffle article order
  function shuffleArticles(list) {
    const result = [...list];

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  // Select two random articles for the navigation arrows
  const arrowChoices = shuffleArticles(otherArticles);
  const leftArticle = arrowChoices[0];
  const rightArticle =
    arrowChoices.length > 1
      ? arrowChoices[1]
      : arrowChoices[0];

  // 6. Create top arrow navigation
  if (!document.getElementById("artikel-panah-navigasi")) {
    const navigation = document.createElement("nav");
    navigation.id = "artikel-panah-navigasi";
    navigation.setAttribute("aria-label", "Article navigation");

    navigation.innerHTML = `
      <a class="panah-artikel panah-kiri"
         href="${escapeHTML(leftArticle.safeLink)}"
         aria-label="Read another article: ${escapeHTML(leftArticle.judul)}">
        <span class="panah-simbol" aria-hidden="true">←</span>
        <span class="panah-info">
          <span class="panah-label">READ NEXT</span>
          <span class="panah-judul">${escapeHTML(leftArticle.judul)}</span>
        </span>
      </a>

      <a class="panah-artikel panah-kanan"
         href="${escapeHTML(rightArticle.safeLink)}"
         aria-label="Explore another article: ${escapeHTML(rightArticle.judul)}">
        <span class="panah-info">
          <span class="panah-label">EXPLORE MORE</span>
          <span class="panah-judul">${escapeHTML(rightArticle.judul)}</span>
        </span>
        <span class="panah-simbol" aria-hidden="true">→</span>
      </a>
    `;

    // Add navigation styles
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
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          pointer-events: none;
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
        }

        #artikel-panah-navigasi .panah-artikel:hover {
          background: #ffe1ee;
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

    // Find the best location for the navigation
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
      topBar.insertAdjacentElement("afterend", navigation);
    } else if (articleContent && articleContent.parentNode) {
      articleContent.parentNode.insertBefore(
        navigation,
        articleContent
      );
    } else {
      document.body.insertBefore(
        navigation,
        document.body.firstChild
      );
    }
  }

  // 7. Select up to three random recommended articles
  const recommendations = shuffleArticles(otherArticles).slice(0, 3);

  const relatedBox = document.createElement("section");
  relatedBox.className = "artikel-terkait-wrapper";

  relatedBox.innerHTML = `
    <div class="artikel-terkait-box">
      <h3 class="artikel-terkait-title">
        💗 Recommended Reads for You
      </h3>

      <p class="artikel-terkait-desc">
        Discover more interesting stories and articles on CewekPedia.
      </p>

      <div class="artikel-terkait-list">
        ${recommendations.map(function (item) {
          return `
            <a class="artikel-terkait-item"
               href="${escapeHTML(item.safeLink)}">
              <span class="artikel-terkait-icon">♡</span>
              <span class="artikel-terkait-text">
                ${escapeHTML(item.judul)}
              </span>
              <span class="artikel-terkait-arrow">›</span>
            </a>
          `;
        }).join("")}
      </div>

      <a class="artikel-terkait-more" href="/en/">
        Explore All Articles →
      </a>
    </div>
  `;

  // 8. Add recommendation styles
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

  // 9. Insert recommendations after the article content
  const target =
    document.querySelector("article") ||
    document.querySelector("main") ||
    document.querySelector(".container");

  if (target) {
    target.appendChild(relatedBox);
  }
});
