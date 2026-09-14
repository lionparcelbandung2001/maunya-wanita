// ==========================================
// MAUNYA WANITA ❤️❤️
// SCRIPT UTAMA
// ==========================================


// Menyimpan pilihan kategori
function chooseCategory(category) {

    localStorage.setItem("mw_category", category);

    // Setelah memilih kategori,
    // lanjut ke halaman pilihan kota
    window.location.href = "kota.html";
}


// Menyimpan pilihan kota
function chooseCity(city) {

    const category = localStorage.getItem("mw_category") || "";

    localStorage.setItem("mw_category", category);
    localStorage.setItem("mw_city", city);

    // Setelah memilih kota,
    // lanjut ke halaman katalog
    window.location.href = "katalog.html";
}


// Mengambil pilihan yang sudah disimpan
function getChoice(key) {

    return localStorage.getItem(key) || "";
}


// Menyiapkan judul halaman kota
function setupCity() {

    const category = getChoice("mw_category");

    const title = document.getElementById("cityTitle");

    if (title) {

        if (category) {
            title.textContent =
                "📍 " + category + " — pilih kotamu";
        } else {
            title.textContent =
                "📍 Pilih kotamu";
        }

    }
}


// Menyiapkan judul halaman katalog
function setupCatalog() {

    const category = getChoice("mw_category");
    const city = getChoice("mw_city");

    const title = document.getElementById("catalogTitle");

    if (title) {

        if (category && city) {

            title.textContent =
                category + " — " + city + " ❤️";

        } else {

            title.textContent =
                "Pilihan untukmu ❤️";

        }

    }
}


// ==========================================
// FORM SARAN
// ==========================================

function demoComment() {

    const box = document.getElementById("comment");
    const status = document.getElementById("commentStatus");

    if (!box || !status) {
        return;
    }

    if (!box.value.trim()) {

        status.textContent =
            "Tulis saranmu dulu ya ❤️";

        return;
    }

    status.textContent =
        "Prototype: nanti komentar ini dikirim ke EchoThread untuk moderasi sebelum tampil.";
}
