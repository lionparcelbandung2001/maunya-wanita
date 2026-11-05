document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // 1. AUTOMATICALLY UPDATE ARTICLE DATES
  // ==========================================

  const timeElements = document.querySelectorAll(
    "time#article-updated-date, time.article-updated-date"
  );

  timeElements.forEach(function (timeElement) {

    const originalDateStr = timeElement.getAttribute("datetime");

    if (!originalDateStr) return;

    // Validate YYYY-MM-DD format
    const match = originalDateStr.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    );

    if (!match) return;

    const originalYear = Number(match[1]);
    const originalMonth = Number(match[2]) - 1;
    const originalDay = Number(match[3]);

    // Use local noon to avoid timezone date shifts
    const originalDate = new Date(
      originalYear,
      originalMonth,
      originalDay,
      12, 0, 0
    );

    // Validate the original date
    if (
      originalDate.getFullYear() !== originalYear ||
      originalDate.getMonth() !== originalMonth ||
      originalDate.getDate() !== originalDay
    ) {
      return;
    }

    const today = new Date();

    // Do not update future dates
    const todayLocal = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12, 0, 0
    );

    if (originalDate > todayLocal) return;

    // Calculate full years passed
    let yearsDifference =
      today.getFullYear() - originalYear;

    const anniversaryThisYear = new Date(
      today.getFullYear(),
      originalMonth,
      originalDay,
      12, 0, 0
    );

    // Adjust for anniversary date
    if (todayLocal < anniversaryThisYear) {
      yearsDifference--;
    }

    if (yearsDifference < 0) return;

    // Preserve original month and day
    let updatedDate = new Date(
      originalYear + yearsDifference,
      originalMonth,
      originalDay,
      12, 0, 0
    );

    // Handle February 29 in non-leap years
    if (
      updatedDate.getMonth() !== originalMonth ||
      updatedDate.getDate() !== originalDay
    ) {
      updatedDate = new Date(
        originalYear + yearsDifference,
        originalMonth,
        28,
        12, 0, 0
      );
    }

    const year = updatedDate.getFullYear();

    const month = String(
      updatedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      updatedDate.getDate()
    ).padStart(2, "0");

    const isoDate = `${year}-${month}-${day}`;

    // English date format (US)
    const formattedDate = updatedDate.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

    // Update visible article date
    timeElement.setAttribute("datetime", isoDate);
    timeElement.textContent = formattedDate;

    // Update JSON-LD dateModified
    const schemaScript = document.getElementById(
      "article-schema"
    );

    if (schemaScript) {
      try {

        const schemaData = JSON.parse(
          schemaScript.textContent
        );

        schemaData.dateModified =
          `${isoDate}T08:00:00+07:00`;

        schemaScript.textContent = JSON.stringify(
          schemaData,
          null,
          2
        );

      } catch (error) {

        console.error(
          "CewekPedia: Failed to update article schema.",
          error
        );

      }
    }

  });


  // ==========================================
  // 2. AUTOMATICALLY UPDATE COPYRIGHT YEAR
  // ==========================================

  const currentYearElements = document.querySelectorAll(
    ".current-year"
  );

  const thisYear = new Date().getFullYear();

  currentYearElements.forEach(function (element) {
    element.textContent = thisYear;
  });

});
