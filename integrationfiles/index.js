const apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=bangalore&appid=04d0c7af428972b6cf16b28fb73c2209&units=metric";

async function updateWeatherWidget() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Elements to update
        const currentTempElement = document.querySelector('.current-temperature');
        const currentConditionElement = document.querySelector('.current-condition');
        const currentIconElement = document.querySelector('.current-weather-icon');
        const forecastDaysElements = document.querySelectorAll('.forecast-day');

        // Update the current weather
        const currentWeather = data.list[0]; // Assuming the first entry is the current weather
        currentTempElement.textContent = `${currentWeather.main.temp}°C`;
        currentConditionElement.textContent = capitalizeFirstLetter(currentWeather.weather[0].description);
        currentIconElement.textContent = getWeatherIcon(currentWeather.weather[0].icon);

        // Create a map to store one forecast per day (midday forecast)
        const forecastMap = {};

        // Filter and map forecast data for the next 5 days
        data.list.forEach(entry => {
            const entryDate = new Date(entry.dt_txt);
            const dayName = entryDate.toLocaleDateString('en-US', { weekday: 'short' });

            // Only store one forecast per day, prefer midday forecasts
            if (entryDate.getHours() === 12) {
                forecastMap[dayName] = {
                    tempMax: entry.main.temp_max,
                    tempMin: entry.main.temp_min,
                    icon: getWeatherIcon(entry.weather[0].icon)
                };
            }
        });

        // Update the forecast section in the widget
        let dayCounter = 0;
        Object.keys(forecastMap).forEach(dayName => {
            if (dayCounter < 5) { 
                // Ensure we only update the first 5 elements
                const dayElement = forecastDaysElements[dayCounter];
                dayElement.querySelector('div').textContent = dayName;
                dayElement.querySelector('.forecast-icon').textContent = forecastMap[dayName].icon;
                dayElement.querySelector('.forecast-temperature').textContent = `${forecastMap[dayName].tempMax}°C ${forecastMap[dayName].tempMin}°C`;
                dayCounter++;
            }
        });

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀️', // Clear sky day
        '01n': '🌕', // Clear sky night
        '02d': '⛅', // Few clouds day
        '02n': '🌤', // Few clouds night
        '03d': '☁️', // Scattered clouds
        '03n': '☁️',
        '04d': '☁️', // Broken clouds
        '04n': '☁️',
        '09d': '🌧', // Shower rain
        '09n': '🌧',
        '10d': '🌦', // Rain day
        '10n': '🌧', // Rain night
        '11d': '🌩', // Thunderstorm
        '11n': '🌩',
        '13d': '❄️', // Snow
        '13n': '❄️',
        '50d': '🌫', // Mist
        '50n': '🌫'
    };
    return iconMap[iconCode] || '❓';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

updateWeatherWidget();
