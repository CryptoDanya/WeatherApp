const API_KEY = 'ca5f8274ab55786f63f1a52a4fb936b4'
const city = 'Kyiv';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
async function getWeather() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        document.querySelector(".city").textContent = data.name;
        document.querySelector("#temp").textContent =
        Math.round(data.main.temp) + "°";
        document.querySelector("#feels-like").textContent =
        Math.round(data.main.feels_like) + "°";
        document.querySelector(".description").textContent =
        data.weather[0].description;
        document.querySelector("#humidity").textContent =
        data.main.humidity + "%";
        document.querySelector("#pressure-number").textContent =
        data.main.pressure;
        document.querySelector("#wind").textContent =
        Math.round(data.wind.speed * 3.6) + " km/h";
        document.querySelector("#weather-icon").src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}
catch(error) {
    console.log("Помилка:", error);
}
}
getWeather();
