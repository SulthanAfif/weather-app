// ========== GANTI DENGAN API KEY KAMU ==========
const API_KEY = "3f902c609163fd1557c221940746380f";

// ========== Dark Mode ==========
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️";
}

darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
        darkModeToggle.textContent = "☀️";
        localStorage.setItem("darkMode", "enabled");
    } else {
        darkModeToggle.textContent = "🌙";
        localStorage.setItem("darkMode", "disabled");
    }
});

// ========== Elemen DOM ==========
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");
const historySection = document.getElementById("historySection");
const historyList = document.getElementById("historyList");

// ========== History ==========
let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

function saveHistory(city) {
    // Hapus jika sudah ada, lalu taruh di depan
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
    searchHistory.unshift(city);
    if (searchHistory.length > 5) searchHistory.pop(); // maksimal 5
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
    renderHistory();
}

function renderHistory() {
    if (searchHistory.length === 0) {
        historySection.classList.add("hidden");
        return;
    }

    historySection.classList.remove("hidden");
    historyList.innerHTML = "";

    searchHistory.forEach(city => {
        const btn = document.createElement("button");
        btn.className = "history-item";
        btn.textContent = city;
        btn.addEventListener("click", () => {
            cityInput.value = city;
            getWeather(city);
        });
        historyList.appendChild(btn);
    });
}

// ========== Ambil Data Cuaca ==========
async function getWeather(city) {
    // Tampilkan loading, sembunyikan yang lain
    loading.classList.remove("hidden");
    errorBox.classList.add("hidden");
    weatherCard.classList.add("hidden");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=id`
        );

        if (!response.ok) {
            throw new Error("Kota tidak ditemukan");
        }

        const data = await response.json();
        displayWeather(data);
        saveHistory(data.name);

    } catch (err) {
        errorBox.textContent = err.message === "Kota tidak ditemukan" 
            ? "Kota tidak ditemukan. Coba cek ejaan atau gunakan nama kota dalam bahasa Inggris." 
            : "Terjadi kesalahan. Periksa koneksi internet atau API Key.";
        errorBox.classList.remove("hidden");
    } finally {
        loading.classList.add("hidden");
    }
}

// ========== Tampilkan Data ==========
function displayWeather(data) {
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    
    const now = new Date();
    document.getElementById("date").textContent = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    document.getElementById("feelsLike").textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

    weatherCard.classList.remove("hidden");
}

// ========== Event ==========
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Render history saat pertama kali dibuka
renderHistory();