const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');
const apiKey = 'a20380c4416b7b558e2af9ee68c4c0fa';

weatherForm.addEventListener('submit', async event => {
    event.preventDefault();

    const city = cityInput.value;

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError('Could not fetch weather data');
        }
    } else {
        displayError('Please enter a city name');
    }
});

async function getWeatherData(city) {
    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${5}&appid=${apiKey}`;
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
            throw new Error('Could not fetch geographical data');
        }

        const geo = await geoResponse.json();

        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${geo[0].lat}&lon=${geo[0].lon}&appid=${apiKey}`;
        const weatherResponse = await fetch(apiUrl);
        if (!weatherResponse.ok) {
            throw new Error('Could not fetch weather data');
        }

        const weatherData = await weatherResponse.json();
        return weatherData;
    } catch (error) {
        throw new Error('Could not fetch weather data');
    }
}

function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, humidity },
        weather: [{ description, id }],
    } = data;

    card.textContent = '';
    card.style.display = 'flex';

    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const descDisplay = document.createElement('p');
    const weatherEmoji = document.createElement('p');

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${((temp - 273.15) * 9/5 + 32).toFixed(1)}°F`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add('cityDisplay');
    tempDisplay.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descDisplay.classList.add('descDisplay');
    weatherEmoji.classList.add('weatherEmoji');

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId) {
    if (weatherId >= 200 && weatherId < 300) {
        return '⛈️';
    }
    else if (weatherId >= 300 && weatherId < 600) {
        return '🌧️';
    }
    else if (weatherId >= 600 && weatherId < 700) {
        return '❄️';
    }
    else if (weatherId >= 700 && weatherId < 800) {
        return '🌫️';
    }
    else if (weatherId === 800) {
        return '☀️';
    }
    else if (weatherId === 801 || weatherId === 802) {
        return '⛅';
    }
    else {
        return '☁️';
    }
}

function displayError(message) {
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');

    card.textContent = '';
    card.style.display = 'flex';
    card.appendChild(errorDisplay);
}
