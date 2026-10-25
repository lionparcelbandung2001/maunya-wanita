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

    // Pastikan tanggal awal menggunakan format YYYY-MM-DD.
    const match = originalDateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) return;

    const originalYear = Number(match[1]);
    const originalMonth = Number(match[2]) - 1;
    const originalDay = Number(match[3]);

    // Gunakan tengah hari lokal untuk mengurangi risiko
    // perubahan tanggal akibat perbedaan zona waktu.
    const originalDate = new Date(
      originalYear,
      originalMonth,
      originalDay,
      12, 0, 0
    );

    // Validasi tanggal agar tanggal tidak valid diabaikan.
    if (
      originalDate.getFullYear() !== originalYear ||
      originalDate.getMonth() !== originalMonth ||
      originalDate.getDate() !== originalDay
    ) {
      return;
    }

    const today = new Date();

    // Jangan mengubah tanggal yang masih berada di masa depan.
    const todayLocal = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12, 0, 0
    );

    if (originalDate > todayLocal) return;

    // Hitung berapa tahun penuh sejak tanggal awal.
    let yearsDifference =
      today.getFullYear() - originalYear;

    const anniversaryThisYear = new Date(
      today.getFullYear(),
      originalMonth,
      originalDay,
      12, 0, 0
    );

    // Koreksi untuk tahun kabisat dan tanggal peringatan.
    if (todayLocal < anniversaryThisYear) {
      yearsDifference--;
    }

    if (yearsDifference < 0) return;

    // Pertahankan bulan dan hari asli; ubah tahunnya
    // hanya jika sudah melewati satu tahun atau lebih.
    let updatedDate = new Date(
      originalYear + yearsDifference,
      originalMonth,
      originalDay,
      12, 0, 0
    );

    // Penanganan khusus tanggal 29 Februari:
    // pada tahun nonkabisat, gunakan 28 Februari.
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
    const month = String(updatedDate.getMonth() + 1).padStart(2, "0");
    const day = String(updatedDate.getDate()).padStart(2, "0");

    const isoDate = `${year}-${month}-${day}`;

    const formattedDate = updatedDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    // Perbarui tanggal yang terlihat oleh pembaca.
    timeElement.setAttribute("datetime", isoDate);
    timeElement.textContent = formattedDate;

    // Perbarui dateModified pada Schema JSON-LD,
    // jika artikel menggunakan schema dengan ID article-schema.
    const schemaScript = document.getElementById("article-schema");

    if (schemaScript) {
      try {
        const schemaData = JSON.parse(schemaScript.textContent);

        schemaData.dateModified = `${isoDate}T08:00:00+07:00`;

        schemaScript.textContent = JSON.stringify(
          schemaData,
          null,
          2
        );
      } catch (error) {
        console.error(
          "CewekPedia: gagal memperbarui Schema artikel.",
          error
        );
      }
    }
  });

  // ==========================================
  // 2. OTOMATIS MEMPERBARUI TAHUN COPYRIGHT
  // ==========================================

  const currentYearElements = document.querySelectorAll(
    ".current-year"
  );

  const thisYear = new Date().getFullYear();

  currentYearElements.forEach(function (element) {
    element.textContent = thisYear;
  });
});
