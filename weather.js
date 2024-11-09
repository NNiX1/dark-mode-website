const OPENWEATHERMAP_API_KEY = 'dace1bed06a93555aae3cc239755f836'; // Replace with actual API key from openweathermap.org

async function fetchWeatherForTrnava() {
    const city = 'Trnava';
    const country = 'SK';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;

    try {
        console.log('Fetching URL:', url);
        console.log('API Key:', OPENWEATHERMAP_API_KEY);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        console.log('Full Response:', response);
        
        if (response.status === 401) {
            console.error('Unauthorized: Check your API key');
            displayWeatherError('API Key Error: Please check your OpenWeatherMap API key');
            return;
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            displayWeatherError(`Weather fetch failed: ${response.statusText}`);
            return;
        }

        const data = await response.json();
        console.log('Received Weather Data:', data);

        if (data.cod === 200) {
            const weatherInfo = {
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            };

            displayWeather(weatherInfo);
        } else {
            console.error('Unexpected data format:', data);
            displayWeatherError('Unable to parse weather data');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        displayWeatherError('Network error: ' + error.message);
    }
}

function displayWeather(weatherInfo) {
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `
        <div class="weather-container">
            <img src="${weatherInfo.icon}" alt="Weather Icon" class="weather-icon">
            <div class="weather-details">
                <p>${weatherInfo.temperature}°C</p>
                <p>${weatherInfo.description}</p>
                <p>Trnava, Slovakia</p>
            </div>
        </div>
    `;
}

function displayWeatherError(message) {
    const weatherDisplay = document.getElementById('weather-display');
    weatherDisplay.innerHTML = `<p class="weather-error">${message}</p>`;
}

// Ensure the function is globally accessible for the button click
window.fetchWeatherForTrnava = fetchWeatherForTrnava;
