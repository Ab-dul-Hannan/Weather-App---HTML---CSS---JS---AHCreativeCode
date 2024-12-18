// Abdul Hannan - Weather App - AHCreativeCode
const apiKey = "804b556b26487b8237f7d3ad20dedc2c"; //Your API Key from Open Weather App

// Add an event listener to the "Check Weather" button
document.getElementById("change-city-btn").addEventListener("click", () => {
    const cityInput = document.getElementById("city-input").value.trim();
    if (cityInput) {
        fetchWeatherData(cityInput);
    } else {
        alert("Please enter a city name.");
    }
});

// Fetch weather data based on the city
async function fetchWeatherData(city = "London") {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        // Fetch Current Weather
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found.");
        const data = await response.json();
        updateWeatherUI(data);

        // Fetch Hourly Forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        updateHourlyForecast(forecastData.list);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Failed to fetch weather data. Please check the city name or your connection.");
    }
}

// Update Main Weather UI
function updateWeatherUI(data) {
    const temperature = Math.round(data.main.temp);

    document.getElementById("location").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").innerHTML = `${temperature}&deg;C`;
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("wind").textContent = `${data.wind.speed} km/h`;
    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("pressure").textContent = `${data.main.pressure} hPa`;

    // Update Date
    const currentDate = new Date();
    document.getElementById("date").textContent = currentDate.toDateString();
}

// Update Hourly Forecast
function updateHourlyForecast(list) {
    const hourlyContainer = document.getElementById("hourly");
    hourlyContainer.innerHTML = ""; // Clear previous data

    // Display the next 4 hourly forecasts
    for (let i = 0; i < 4; i++) {
        const forecast = list[i];
        const time = new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = Math.round(forecast.main.temp);
        const weatherIcon = forecast.weather[0].main;

        // Dynamic Weather Icon
        const iconClass = getWeatherIcon(weatherIcon);

        hourlyContainer.innerHTML += `
            <div>
                <i class='bx ${iconClass}'></i>
                <p>${time}</p>
                <p>${temp}&deg;C</p>
            </div>
        `;
    }
}

// Map Weather Condition to Icons
function getWeatherIcon(condition) {
    switch (condition) {
        case "Clear": return "bx-sun";
        case "Clouds": return "bx-cloud";
        case "Rain": return "bx-cloud-rain";
        case "Snow": return "bx-cloud-snow";
        case "Thunderstorm": return "bx-cloud-lightning";
        default: return "bx-cloud";
    }
}

// Call Fetch on Page Load
fetchWeatherData();
