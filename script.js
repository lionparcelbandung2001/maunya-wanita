// ==========================================
// MAUNYA WANITA ❤️❤️
// SCRIPT UTAMA
// ==========================================


// ==========================================
// PILIH KATEGORI
// ==========================================

function chooseCategory(category) {

    localStorage.setItem("mw_category", category);

    // Hapus kota sebelumnya supaya pilihan baru
    // tidak tercampur dengan pilihan sebelumnya
    localStorage.removeItem("mw_city");

    window.location.href = "kota.html";
}


// ==========================================
// PILIH KOTA
// ==========================================

function chooseCity(city) {

    const category = localStorage.getItem("mw_category") || "";

    localStorage.setItem("mw_category", category);
    localStorage.setItem("mw_city", city);

    window.location.href = "katalog.html";
}


// ==========================================
// AMBIL DATA PILIHAN
// ==========================================

function getChoice(key) {

    return localStorage.getItem(key) || "";

}


// ==========================================
// SETUP HALAMAN KOTA
// ==========================================

function setupCity() {

    const category = getChoice("mw_category");

    const title =
        document.getElementById("cityTitle");

    if (!title) return;


    if (category) {

        title.textContent =
            "📍 " + category + " — pilih kotamu";

    } else {

        title.textContent =
            "📍 Pilih kotamu";

    }

}


// ==========================================
// SETUP HALAMAN KATALOG
// ==========================================

function setupCatalog() {

    const category =
        getChoice("mw_category");

    const city =
        getChoice("mw_city");

    const title =
        document.getElementById("catalogTitle");


    if (!title) return;


    if (category && city) {

        title.textContent =
            category + " — " + city + " ❤️";

        loadCityData(city, category);

    } else {

        title.textContent =
            "Pilihan untukmu ❤️";

    }

}


// ==========================================
// LOAD DATA KOTA
// ==========================================

function loadCityData(city, category) {

    // Contoh:
    // Bandung → bandung.js
    // Jakarta → jakarta.js

    const fileName =
        city
            .toLowerCase()
            .replace(/ /g, "-");


    const script =
        document.createElement("script");


    script.src =
        "data/" + fileName + ".js";


    // ======================================
    // JIKA FILE BERHASIL DIMUAT
    // ======================================

    script.onload = function () {

        // Contoh:
        // Bandung → bandungData
        // Jakarta → jakartaData

        const variableName =
            city
                .toLowerCase()
                .replace(/[^a-zA-Z0-9]/g, "") +
            "Data";


        const cityData =
            window[variableName];


        // Jika data kota tidak ditemukan
        if (!cityData) {

            console.error(
                "Data tidak ditemukan:",
                variableName
            );

            showNoData();

            return;

        }


        // ==================================
        // FILTER BERDASARKAN KATEGORI
        // ==================================

        const filteredData =
            cityData.filter(function (item) {

                return item.kategori === category;

            });


        // ==================================
        // TAMPILKAN DATA
        // ==================================

        displayCatalog(filteredData);

    };


    // ======================================
    // JIKA FILE GAGAL DIMUAT
    // ======================================

    script.onerror = function () {

        console.error(
            "File data tidak ditemukan:",
            script.src
        );

        showNoData();

    };


    // Masukkan script data ke halaman
    document.body.appendChild(script);

}


// ==========================================
// TAMPILKAN KATALOG
// ==========================================

function displayCatalog(data) {

    const container =
        document.getElementById("catalogCards");

    const noData =
        document.getElementById("noData");


    if (!container) return;


    // Kosongkan katalog sebelumnya
    container.innerHTML = "";


    // ======================================
    // JIKA TIDAK ADA DATA
    // ======================================

    if (!data || data.length === 0) {

        showNoData();

        return;

    }


    // Sembunyikan pesan tidak ada data
    if (noData) {

        noData.style.display = "none";

    }


    // ======================================
    // BUAT CARD SATU PER SATU
    // ======================================

    data.forEach(function (item) {

        const card =
            document.createElement("article");


        card.className = "card";


        // ==================================
        // ISI CARD
        // ==================================

        card.innerHTML = `

            <div class="photo">
                ✨
            </div>

            <div class="card-body">

                <h3>
                    ${item.nama}
                </h3>

                <p>
                    📍 ${item.jenis}
                </p>

                <p>
                    ✨ ${item.deskripsi}
                </p>

                ${
                    item.link &&
                    item.link !== "#"

                    ?

                    `
                    <a
                        class="button"
                        href="${item.link}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Lihat Link Resmi →
                    </a>
                    `

                    :

                    `
                    <span
                        class="button"
                        style="opacity:0.6;"
                    >
                        Link resmi belum tersedia
                    </span>
                    `

                }

            </div>

        `;


        container.appendChild(card);

    });

}


// ==========================================
// JIKA DATA TIDAK DITEMUKAN
// ==========================================

function showNoData() {

    const container =
        document.getElementById("catalogCards");

    const noData =
        document.getElementById("noData");


    if (container) {

        container.innerHTML = "";

    }


    if (noData) {

        noData.style.display = "block";

        noData.textContent =
            "Maaf, data untuk pilihan ini belum tersedia. ❤️";

    }

}


// ==========================================
// FORM SARAN / PROTOTYPE
// ==========================================

function demoComment() {

    const box =
        document.getElementById("comment");

    const status =
        document.getElementById("commentStatus");


    if (!box || !status) return;


    // ======================================
    // CEK KOSONG
    // ======================================

    if (!box.value.trim()) {

        status.textContent =
            "Tulis saranmu dulu ya ❤️";

        return;

    }


    // ======================================
    // PESAN SEMENTARA
    // ======================================

    status.textContent =
        "Prototype: nanti komentar ini dikirim ke EchoThread untuk moderasi sebelum tampil.";

}


// ==========================================
// JALANKAN OTOMATIS SAAT HALAMAN DIBUKA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupCity();

        setupCatalog();

    }
);
