const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

// Create and reuse elements inside the card
const cityDisplay = document.createElement("h1");
cityDisplay.className = "cityDisplay";

const tempDisplay = document.createElement("p");
tempDisplay.className = "tempDisplay";

const humidityDisplay = document.createElement("p");
humidityDisplay.className = "humidityDisplay";

const descDisplay = document.createElement("p");
descDisplay.className = "descDisplay";

const weatherEmoji = document.createElement("p");
weatherEmoji.className = "weatherEmoji";

const errorDisplay = document.createElement("p");
errorDisplay.className = "errorDisplay";

card.append(cityDisplay, tempDisplay, humidityDisplay, descDisplay, weatherEmoji, errorDisplay);

// Replace this with your actual OpenWeatherMap API key
const apiKey = "bcc42214cff503599dbdb063a392498e";

weatherForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city");
    return;
  }

  try {
    const data = await getWeather(city);
    displayWeather(data);
  } catch (error) {
    showError("City not found. Try again.");
  }
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Invalid response");
  }
  return await response.json();
}

function displayWeather(data) {
  const { name } = data;
  const { temp, humidity } = data.main;
  const { description, icon } = data.weather[0];

  cityDisplay.textContent = name;
  tempDisplay.textContent = `${Math.round(temp)}°F`;
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  descDisplay.textContent = capitalize(description);
  weatherEmoji.textContent = getEmoji(icon);
  errorDisplay.textContent = "";

  card.style.display = "block";
}

function showError(message) {
  card.style.display = "block";
  cityDisplay.textContent = "";
  tempDisplay.textContent = "";
  humidityDisplay.textContent = "";
  descDisplay.textContent = "";
  weatherEmoji.textContent = "";
  errorDisplay.textContent = message;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getEmoji(icon) {
  const emojiMap = {
    "01d": "☀️", "01n": "🌙",
    "02d": "🌤️", "02n": "🌥️",
    "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌧️",
    "11d": "🌩️", "11n": "🌩️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️"
  };

  return emojiMap[icon] || "❓";
}
