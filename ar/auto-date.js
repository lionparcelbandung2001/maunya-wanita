document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // 1. OTOMATIS MEMPERBARUI TANGGAL ARTIKEL
  // ==========================================

  const timeElements = document.querySelectorAll(
    "time#article-updated-date, time.article-updated-date"
  );

  timeElements.forEach(function (timeElement) {

    const originalDateStr = timeElement.getAttribute("datetime");

    if (!originalDateStr) return;

    // Format tanggal awal harus YYYY-MM-DD.
    const match = originalDateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) return;

    const originalYear = Number(match[1]);
    const originalMonth = Number(match[2]) - 1;
    const originalDay = Number(match[3]);

    // Gunakan tengah hari lokal untuk menghindari
    // masalah perbedaan zona waktu.
    const originalDate = new Date(
      originalYear,
      originalMonth,
      originalDay,
      12, 0, 0
    );

    // Validasi tanggal.
    if (
      originalDate.getFullYear() !== originalYear ||
      originalDate.getMonth() !== originalMonth ||
      originalDate.getDate() !== originalDay
    ) {
      return;
    }

    const today = new Date();

    const todayLocal = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12, 0, 0
    );

    // Jangan mengubah tanggal masa depan.
    if (originalDate > todayLocal) return;

    // Hitung selisih tahun penuh.
    let yearsDifference =
      today.getFullYear() - originalYear;

    const anniversaryThisYear = new Date(
      today.getFullYear(),
      originalMonth,
      originalDay,
      12, 0, 0
    );

    if (todayLocal < anniversaryThisYear) {
      yearsDifference--;
    }

    if (yearsDifference < 0) return;

    // Pertahankan bulan dan hari asli.
    let updatedDate = new Date(
      originalYear + yearsDifference,
      originalMonth,
      originalDay,
      12, 0, 0
    );

    // Penanganan tanggal 29 Februari.
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

    // ==========================================
    // FORMAT TANGGAL BAHASA ARAB
    // Kalender Gregorian
    // ==========================================

    const formattedDate = new Intl.DateTimeFormat(
      "ar",
      {
        calendar: "gregory",
        day: "numeric",
        month: "long",
        year: "numeric",
        numberingSystem: "arab"
      }
    ).format(updatedDate);

    // Perbarui tanggal yang terlihat.
    timeElement.setAttribute("datetime", isoDate);

    timeElement.textContent = formattedDate;

    // ==========================================
    // 2. PERBARUI SCHEMA JSON-LD
    // ==========================================

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
          "CewekPedia: تعذر تحديث بيانات المقال المنظمة.",
          error
        );

      }

    }

  });

  // ==========================================
  // 3. OTOMATIS MEMPERBARUI TAHUN COPYRIGHT
  // ==========================================

  const currentYearElements = document.querySelectorAll(
    ".current-year"
  );

  const thisYear = new Date().getFullYear();

  const arabicYear = new Intl.NumberFormat(
    "ar",
    {
      numberingSystem: "arab"
    }
  ).format(thisYear);

  currentYearElements.forEach(function (element) {

    element.textContent = arabicYear;

  });

});
