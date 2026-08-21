const API_KEY = 'ca5f8274ab55786f63f1a52a4fb936b4';
let city = 'Kyiv';
function getWeatherUrl() {
    return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
}
function getForecastUrl() {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
}
async function getWeather() {
    try {
        const response = await fetch(getWeatherUrl());
        if (!response.ok) {
            throw new Error("Не вдалося отримати дані");
        }
        const data = await response.json();
        if (String(data.cod) !== "200") {
            throw new Error(data.message);
        }
        document.querySelector(".city").textContent = data.name;
        document.querySelector(".coordinates").textContent =
            `${data.coord.lat}°, ${data.coord.lon}°`;
        document.querySelector("#temp").textContent =
            Math.round(data.main.temp) + "°";
        document.querySelector("#feels-like").textContent =
            Math.round(data.main.feels_like) + "°";
        document.querySelector(".description").textContent =
            data.weather[0].description;
        document.querySelector("#high").textContent =
            Math.round(data.main.temp_max) + "°";
        document.querySelector("#low").textContent =
            Math.round(data.main.temp_min) + "°";
        document.querySelector("#humidity").textContent =
            data.main.humidity + "%";
        document.querySelector("#pressure-number").textContent =
            data.main.pressure;
        document.querySelector("#wind").textContent =
            Math.round(data.wind.speed * 3.6) + " km/h";
        document.querySelector("#visibility-number").textContent =
            Math.round(data.visibility / 1000);
        document.querySelector("#weather-icon").src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        const sunriseTime = new Date(data.sys.sunrise * 1000)
            .toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        const sunsetTime = new Date(data.sys.sunset * 1000)
            .toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        document.querySelector("#sunrise").textContent = sunriseTime;
        document.querySelector("#sunset").textContent = sunsetTime;

        const date = new Date((data.dt + data.timezone) * 1000);

        document.querySelector("#weekday").textContent =
            date.toLocaleDateString("en-US", {
                weekday: "long",
                timeZone: "UTC"
            });

        document.querySelector("#day").textContent =
            date.toLocaleDateString("en-US", {
                day: "numeric",
                timeZone: "UTC"
            });

        document.querySelector("#month").textContent =
            date.toLocaleDateString("en-US", {
                month: "long",
                timeZone: "UTC"
            });
        const currentTime = new Date()
            .toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        document.querySelector(".time").textContent = currentTime;
    } catch (error) {
        console.log("Помилка погоди:", error);
    }
}
async function getForecast() {
    try {
        const response = await fetch(getForecastUrl());
        if (!response.ok) {
            throw new Error("Не вдалося отримати дані");
        }
        const data = await response.json();
        if (String(data.cod) !== "200") {
            throw new Error(data.message);
        }
        const hourlyBlock = document.querySelector("#hourlyForecast");
        const dailyBlock = document.querySelector("#dailyForecast");
        if (hourlyBlock) {
            hourlyBlock.innerHTML = "";
        }
        if (dailyBlock) {
            dailyBlock.innerHTML = "";
        }
        const hourlyData = data.list.slice(0, 8);
        hourlyData.forEach(item => {
            const time = item.dt_txt.slice(11, 16);
            const card = document.createElement("div");
            card.classList.add("forecast-card");
            card.innerHTML = `
                <p>${time}</p>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
                <p>${Math.round(item.main.temp)}°</p>
            `;
            if (hourlyBlock) {
                hourlyBlock.appendChild(card);
            }
        });
        const dailyData = data.list.filter((_, index) => index % 8 === 0);
        dailyData.forEach(item => {
            const dateObj = new Date(item.dt * 1000);
            const dayName = dateObj.toLocaleDateString("uk-UA", {
                weekday: "short"
            });
            const card = document.createElement("div");
            card.classList.add("daily-card");
            card.innerHTML = `
                <span class="day-name">${dayName}</span>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="icon">
                <span class="day-temp">${Math.round(item.main.temp_max)}° / ${Math.round(item.main.temp_min)}°</span>
            `;
            if (dailyBlock) {
                dailyBlock.appendChild(card);
            }
        });
    } catch (error) {
        console.log("Помилка прогнозу:", error);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const hourlyBtn = document.querySelector("#hourlyBtn");
    const dailyBtn = document.querySelector("#dailyBtn");
    const hourlyForecast = document.querySelector("#hourlyForecast");
    const dailyForecast = document.querySelector("#dailyForecast");
    const cityInput = document.querySelector("#cityInput");
    const searchBtn = document.querySelector("#searchBtn");
    if (hourlyBtn && dailyBtn) {
        hourlyBtn.addEventListener("click", () => {
            hourlyBtn.classList.add("active");
            dailyBtn.classList.remove("active");
            if (hourlyForecast) {
                hourlyForecast.style.display = "flex";
            }
            if (dailyForecast) {
                dailyForecast.style.display = "none";
            }
        });
        dailyBtn.addEventListener("click", () => {
            dailyBtn.classList.add("active");
            hourlyBtn.classList.remove("active");
            if (dailyForecast) {
                dailyForecast.style.display = "flex";
            }
            if (hourlyForecast) {
                hourlyForecast.style.display = "none";
            }
        });
    }
    searchBtn.addEventListener("click", () => {
        const newCity = cityInput.value.trim();
        if (newCity === "") {
            return;
        }
        city = newCity;
        getWeather();
        getForecast();
        cityInput.value = "";
    });
    cityInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchBtn.click();
        }
    });
});
getWeather();
getForecast();
