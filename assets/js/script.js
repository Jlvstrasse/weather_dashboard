const apiKey = '435de679ae8c864633a0cd188cc9c44a'; 
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const historyList = document.getElementById('history');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
        addToHistory(city);
    }
});

historyList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const city = event.target.textContent;
        getWeatherData(city);
    }
});

function addToHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderHistory();
    }
}

function renderHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        historyList.appendChild(li);
    });
}

function getWeatherData(city) {
    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                fetchWeather(lat, lon);
                fetchForecast(lat, lon);
            } else {
                alert('City not found');
            }
        });
}

function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        });
}

function fetchForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        });
}

function displayCurrentWeather(data) {
    currentWeather.innerHTML = `
        <div class="weather-card">
            <h3>${data.name}</h3>
            <p>${new Date().toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
            <p>Temp: ${data.main.temp} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} m/s</p>
        </div>
    `;
}

function displayForecast(data) {
    forecast.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecastData = data.list[i];
        forecast.innerHTML += `
            <div class="weather-card">
                <h3>${new Date(forecastData.dt_txt).toLocaleDateString()}</h3>
                <img src="https://openweathermap.org/img/w/${forecastData.weather[0].icon}.png" alt="${forecastData.weather[0].description}">
                <p>Temp: ${forecastData.main.temp} °C</p>
                <p>Humidity: ${forecastData.main.humidity}%</p>
                <p>Wind: ${forecastData.wind.speed} m/s</p>
            </div>
        `;
    }
}

// history on page load
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
});