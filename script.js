// ========== GANTI DENGAN API KEY KAMU ==========
const API_KEY = "3f902c609163fd1557c221940746380f";

// ========== State ==========
let currentUnit = localStorage.getItem("weatherUnit") || "metric"; // metric = °C, imperial = °F
let lastWeatherData = null;
let lastForecastData = null;

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

// ========== Unit Toggle ==========
const unitToggle = document.getElementById("unitToggle");
unitToggle.textContent = currentUnit === "metric" ? "°C" : "°F";

unitToggle.addEventListener("click", () => {
    currentUnit = currentUnit === "metric" ? "imperial" : "metric";
    localStorage.setItem("weatherUnit", currentUnit);
    unitToggle.textContent = currentUnit === "metric" ? "°C" : "°F";

    // Render ulang jika data sudah ada
    if (lastWeatherData) {
        displayWeather(lastWeatherData);
        displayForecast(lastForecastData);
    }
});

// ========== Elemen ==========
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const locationBtn = document.getElementById("locationBtn");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");
const forecastSection = document.getElementById("forecastSection");
const forecastList = document.getElementById("forecastList");
const historySection = document.getElementById("historySection");
const historyList = document.getElementById("historyList");

// ========== History ==========
let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

function saveHistory(city) {
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
    searchHistory.unshift(city);
    if (searchHistory.length > 5) searchHistory.pop();
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
            getWeatherByCity(city);
        });
        historyList.appendChild(btn);
    });
}

// ========== Helper ==========
function getTempSymbol() {
    return currentUnit === "metric" ? "°C" : "°F";
}

function convertTemp(temp) {
    // Data selalu diambil dalam metric, lalu dikonversi jika perlu
    if (currentUnit === "imperial") {
        return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
}

function setWeatherBackground(main) {
    body.classList.remove("clear", "clouds", "rain", "thunderstorm", "snow", "mist", "fog", "haze");
    const condition = main.toLowerCase();
    if (condition.includes("clear")) body.classList.add("clear");
    else if (condition.includes("cloud")) body.classList.add("clouds");
    else if (condition.includes("rain") || condition.includes("drizzle")) body.classList.add("rain");
    else if (condition.includes("thunder")) body.classList.add("thunderstorm");
    else if (condition.includes("snow")) body.classList.add("snow");
    else body.classList.add("mist");
}

// ========== Fetch Weather ==========
async function getWeatherByCity(city) {
    showLoading();
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=id`
        );
        if (!res.ok) throw new Error("Kota tidak ditemukan");

        const data = await res.json();
        lastWeatherData = data;
        displayWeather(data);
        saveHistory(data.name);

        // Ambil forecast
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=id`
        );
        const forecastData = await forecastRes.json();
        lastForecastData = forecastData;
        displayForecast(forecastData);

    } catch (err) {
        showError(err.message === "Kota tidak ditemukan"
            ? "Kota tidak ditemukan. Coba gunakan nama kota dalam bahasa Inggris."
            : "Terjadi kesalahan. Cek koneksi atau API Key.");
    } finally {
        hideLoading();
    }
}

async function getWeatherByCoords(lat, lon) {
    showLoading();
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
        );
        if (!res.ok) throw new Error("Gagal mengambil data lokasi");

        const data = await res.json();
        lastWeatherData = data;
        displayWeather(data);
        saveHistory(data.name);

        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
        );
        const forecastData = await forecastRes.json();
        lastForecastData = forecastData;
        displayForecast(forecastData);

    } catch (err) {
        showError("Gagal mendapatkan lokasi. Pastikan izin lokasi diizinkan.");
    } finally {
        hideLoading();
    }
}

// ========== Display ==========
function displayWeather(data) {
    document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("date").textContent = new Date().toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    document.getElementById("temperature").textContent = `${convertTemp(data.main.temp)}${getTempSymbol()}`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    document.getElementById("feelsLike").textContent = `${convertTemp(data.main.feels_like)}${getTempSymbol()}`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind.speed} m/s`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

    setWeatherBackground(data.weather[0].main);
    weatherCard.classList.remove("hidden");
}

function displayForecast(data) {
    // Ambil 1 data per hari (setiap jam 12:00)
    const daily = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        const hour = item.dt_txt.split(" ")[1];
        if (hour === "12:00:00" && !daily[date]) {
            daily[date] = item;
        }
    });

    const days = Object.values(daily).slice(0, 5);
    forecastList.innerHTML = "";

    days.forEach(item => {
        const dayName = new Date(item.dt_txt).toLocaleDateString("id-ID", { weekday: "short" });
        const div = document.createElement("div");
        div.className = "forecast-item";
        div.innerHTML = `
            <div class="day">${dayName}</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="">
            <div class="temp">${convertTemp(item.main.temp)}${getTempSymbol()}</div>
        `;
        forecastList.appendChild(div);
    });

    forecastSection.classList.remove("hidden");
}

// ========== UI Helpers ==========
function showLoading() {
    loading.classList.remove("hidden");
    errorBox.classList.add("hidden");
    weatherCard.classList.add("hidden");
    forecastSection.classList.add("hidden");
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove("hidden");
}

// ========== Events ==========
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) getWeatherByCity(city);
});

locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        showError("Browser tidak mendukung geolocation.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => showError("Gagal mendapatkan lokasi. Izinkan akses lokasi di browser.")
    );
});

// Init
renderHistory();